import {findFontContent} from "./FontDataSource";
import {PdfTemplateId, PdfTemplateMap, PdfTemplateTextField} from "./PdfTemplate";
import {findPdfFormTemplateBinary} from "./PdfTemplateDataSource";
import {findSealImageContent} from "./SealDataSource";

import {PDFDocument, PDFFont, PDFImage, PDFTextField} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';


/**
 * PDFビルダーの抽象型定義
 * ビルダーはテンプレートを受け取り、PDFのバイナリを返す
 */
export type PdfTemplateBuilder = <T extends PdfTemplateId>(
    templateId: T,
    data: PdfTemplateMap[T]
) => Promise<Buffer>;

/**
 * pdf-libを使用したPDF生成のビルダーを作成するファクトリ関数
 *
 * @returns PDFビルダー
 * @param findPdfFormTemplateBinary
 * @param findSealImageContent
 * @param findFontContent
 */
export const createPdfLibTemplateBuilder = (
    findPdfFormTemplateBinary: findPdfFormTemplateBinary,
    findSealImageContent: findSealImageContent,
    findFontContent: findFontContent
): PdfTemplateBuilder => {
    return async <T extends PdfTemplateId>(
        templateId: T,
        data: PdfTemplateMap[T]
    ): Promise<Buffer> => {
        // テンプレートのバイナリを取得し読み込み
        const templateContent = await findPdfFormTemplateBinary(templateId);
        const pdfDoc = await PDFDocument.load(templateContent)
        pdfDoc.registerFontkit(fontkit);
        
        // ドキュメントメタデータ設定
        if (data.metaData) {
            if (data.metaData.title) pdfDoc.setTitle(data.metaData.title);
            if (data.metaData.author) pdfDoc.setAuthor(data.metaData.author);
            if (data.metaData.subject) pdfDoc.setSubject(data.metaData.subject);
            if (data.metaData.keywords) pdfDoc.setKeywords(data.metaData.keywords);
            if (data.metaData.creator) pdfDoc.setCreator(data.metaData.creator);
            if (data.metaData.producer) pdfDoc.setProducer(data.metaData.producer);
        }

        // 必要なフォントを取得し埋め込んで保管
        const fontMap : { [key: string]: PDFFont } = {};
        const templateFields = Object.values(data.fields);
        for (const field of templateFields) {
            if (!field.font) continue;
            if (fontMap[field.font]) continue;
            const fontBytes = await findFontContent(field.font);
            fontMap[field.font] = await pdfDoc.embedFont(fontBytes,{ subset: true});
        }

        // フォームに値を設定
        const form = pdfDoc.getForm();
        for (const field of form.getFields()) {
            const type = field.constructor.name
            if (type !== 'PDFTextField')  continue;

            const name = field.getName()
            if (name in data.fields) {
                const textField = field as PDFTextField
                const fieldData = data.fields[name as keyof typeof data.fields] as PdfTemplateTextField;
                textField.setText(fieldData.value ?? '')
                if (fieldData.font) textField.updateAppearances(fontMap[fieldData.font]);
            }
        }
        form.flatten(); // フラット化して編集不能に

        // 必要な印影画像を取得し埋め込んで保管
        const sealImageMap: { [key: string]: PDFImage } = {};
        for (const templateSeal of data.seals) {
            if (sealImageMap[templateSeal.sealId]) continue;
            const sealContent = await findSealImageContent(templateSeal.sealId);
            sealImageMap[templateSeal.sealId] = await pdfDoc.embedPng(sealContent);
        }

        // PDFに捺印を配置
        for (const templateSeal of data.seals) {
            const pages = pdfDoc.getPages();
            const page = pages[templateSeal.page];
            const sealImage = sealImageMap[templateSeal.sealId];
            page.drawImage(sealImage, {
                x: templateSeal.position.x,
                y: templateSeal.position.y,
                width: templateSeal.size.width,
                height: templateSeal.size.height,
            });
        }   

        return Buffer.from(await pdfDoc.save());
    }
}