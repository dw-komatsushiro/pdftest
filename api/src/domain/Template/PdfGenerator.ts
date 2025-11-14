// PDFを生成する処理の定義 処理はテンプレートに対して1:1を想定

// 抽象定義
import {PdfTemplateDefenition} from "./PdfTemplate";
export interface GeneratePdfTemplateInput {
    templateId: string;
    fieldValues: { [fieldId: string]: string; };
    requiredStamps: Array<string>;
    metaData?: {
        title?: string;
        author?: string;
        subject?: string;
        keywords?: string[];
        creator?: string;
        producer?: string;
    };
}

type PDFGenerator = (
    templateBinary: Buffer,
    sealBinaries: Record<string, Buffer>,
    fontBinaries: Record<string, Buffer>,
    inputData: GeneratePdfTemplateInput,
    template: PdfTemplateDefenition
) => Promise<Buffer>;

export enum PdfTemplateGeneratorType {
    PDF_LIB_WITH_FORM = 'form-pdflib',
    PDFME = 'pdfme',
}

export type getGenerator =  (type: PdfTemplateGeneratorType) => PDFGenerator;

export const getGenerator: getGenerator = (type: PdfTemplateGeneratorType): PDFGenerator => {
    if (type === PdfTemplateGeneratorType.PDF_LIB_WITH_FORM) {
        return PdfFormWithPdfLibGenerator;
    }
    if (type === PdfTemplateGeneratorType.PDFME) {
        return PdfMeGenerator;
    }
    throw new Error(`Unsupported PDF generator type: ${type}`);
}


/** --- **/
import {PDFDocument, PDFField, PDFFont, PDFImage, PDFTextField} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// PDFFormで作成されたテンプレート向けのpdf-libによる実装
const PdfFormWithPdfLibGenerator: PDFGenerator = async (
    templateBinary: Buffer,
    sealBinaries: Record<string, Buffer>,
    fontBinaries: Record<string, Buffer>,
    inputData: GeneratePdfTemplateInput,
    template: PdfTemplateDefenition
): Promise<Buffer> => {
    // テンプレートのバイナリを取得し読み込み
    const pdfDoc = await PDFDocument.load(templateBinary)
    pdfDoc.registerFontkit(fontkit);

    // ドキュメントメタデータ設定
    if (inputData.metaData) {
        if (inputData.metaData.title) pdfDoc.setTitle(inputData.metaData.title);
        if (inputData.metaData.author) pdfDoc.setAuthor(inputData.metaData.author);
        if (inputData.metaData.subject) pdfDoc.setSubject(inputData.metaData.subject);
        if (inputData.metaData.keywords) pdfDoc.setKeywords(inputData.metaData.keywords);
        if (inputData.metaData.creator) pdfDoc.setCreator(inputData.metaData.creator);
        if (inputData.metaData.producer) pdfDoc.setProducer(inputData.metaData.producer);
    }

    // 必要なフォントを取得し埋め込んで保管
    const fontMap : { [key: string]: PDFFont } = {};
    const templateFields = Object.values(template.inputFields);
    for (const field of templateFields) {
        if (!field.font) continue;
        if (fontMap[field.font]) continue;
        if (!fontBinaries[field.font]) continue;
        fontMap[field.font] = await pdfDoc.embedFont(fontBinaries[field.font],{ subset: true});
    }

    // フォームに値を設定
    const form = pdfDoc.getForm();
    for (const fieldDef of templateFields) {
        try {
            // フィールドを取得(取れない場合エラーを吐くので次へ)
            const field:PDFField = form.getField(fieldDef.fieldId)

            // テキストフィールで、対応する値があることを確認
            const type = field.constructor.name
            if (type !== 'PDFTextField')  continue;
            if (!inputData.fieldValues[fieldDef.fieldId]) continue;

            // 値とフォントを設定
            const textField: PDFTextField = field as PDFTextField
            textField.setText(inputData.fieldValues[fieldDef.fieldId])
            if (fieldDef.font) textField.updateAppearances(fontMap[fieldDef.font]);
        } catch {
            continue;
        }
    }
    form.flatten(); // フラット化して編集不能に


    // 必要な印影画像を埋め込んで保管
    const sealImageMap: { [key: string]: PDFImage } = {};
    for (const sealId of inputData.requiredStamps) {
        if (sealImageMap[sealId]) continue;
        if (!sealBinaries[sealId]) continue;
        sealImageMap[sealId] = await pdfDoc.embedPng(sealBinaries[sealId]);
    }

    // PDFに捺印を差し込み(捺印は画像フォームに流し込み)
    for (const templateSeal of template.sealPositions) {
        // 位置指定必須
        if (!templateSeal.page ||
            !templateSeal.position?.x ||
            !templateSeal.position?.y ||
            !templateSeal.size?.width ||
            !templateSeal.size?.height
        ) continue;

        // 捺印先のページを取得(なければスキップ)
        const pages = pdfDoc.getPages();
        if (templateSeal.page < 0 || templateSeal.page >= pages.length) continue
        const page = pages[templateSeal.page];

        // 捺印画像を取得(なければスキップ)
        const sealImage = sealImageMap[templateSeal.sealId];
        if (!sealImage) continue;

        page.drawImage(sealImage, {
            x: templateSeal.position.x,
            y: templateSeal.position.y,
            width: templateSeal.size.width,
            height: templateSeal.size.height,
        });
    }

    return Buffer.from(await pdfDoc.save());

}

/** --- **/
import { generate } from '@pdfme/generator';
import { image, text, multiVariableText } from "@pdfme/schemas";

// pdfmeで作成されたテンプレート向けのpdfmeによる実装
const PdfMeGenerator: PDFGenerator = async (
    templateBinary: Buffer,
    sealBinaries: Record<string, Buffer>,
    fontBinaries: Record<string, Buffer>,
    inputData: GeneratePdfTemplateInput,
): Promise<Buffer> => {
    // pdfmeテンプレートはJSONファイルとして保存されているものを読み込む
    // templateBinaryはJSONテンプレートとして扱う
    let pdfmeTemplate;
    try {
        pdfmeTemplate = JSON.parse(templateBinary.toString('utf-8'));
    } catch (error) {
        throw new Error(`Invalid pdfme template JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // seal画像をフィールド値に追加
    const fieldValues = { ...inputData.fieldValues };

    // テンプレートからseal_で始まるフィールドを検索して画像を設定
    if (pdfmeTemplate.schemas && pdfmeTemplate.schemas[0]) {
        for (const field of pdfmeTemplate.schemas[0]) {
            if (field.name && field.name.startsWith('seal_') && field.type === 'image') {
                // seal_prefixを除いたsealIdを取得（スペース以降は無視）
                const sealId = field.name.replace('seal_', '').split(' ')[0];
                if (inputData.requiredStamps.includes(sealId) && sealBinaries[sealId]) {
                    // 画像をbase64形式で設定
                    const base64Image = `data:image/png;base64,${sealBinaries[sealId].toString('base64')}`;
                    fieldValues[field.name] = base64Image;
                }
            }
        }
    }

    const inputs = [fieldValues];

    // フォントファイルを準備（pdfmeの形式に合わせる）
    const fontEntries = Object.entries(fontBinaries);
    const fonts = Object.fromEntries(
        fontEntries.map(([name, buffer], index) => [
            name,
            {
                data: new Uint8Array(buffer),
                fallback: index === 0 // 最初のフォントをfallbackに設定
            }
        ])
    );

    try {
        const pdf = await generate({
            template: pdfmeTemplate,
            inputs,
            plugins: { text, image, multiVariableText },
            options: {
                font: fonts
            }
        });

        return Buffer.from(pdf);
    } catch (error) {
        console.error('PdfMe generation failed:', error);
        throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}