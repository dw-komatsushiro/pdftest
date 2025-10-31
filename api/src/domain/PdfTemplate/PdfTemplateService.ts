import { findFontContentFromBundle } from "./FontDataSource";
import { PdfTemplateDocumentMetadata, PdfTemplateId, PdfTemplateMap, PdfTemplateTextField } from "./PdfTemplate";
import { createPdfLibTemplateBuilder } from "./PdfTemplateBuilderFactory";
import { findPdfFormTemplateBinaryFromBundle } from "./PdfTemplateDataSource";
import { findSealImageContentFromGoogleDrive } from "./SealDataSource";

/**
 * サンプルPDFを構築するサービス関数の実装
 * @param input 
 * @returns 
 */
export const buildExamplePdfTemplate = async (input: {
    exampleId: string,
    documentMetadata?: PdfTemplateDocumentMetadata,
    needSeal: boolean,
    name: string, // 宛名
    note?: string, // 備考
    quantity: number, // 枚数
}): Promise<Buffer> => {

    // 何かしらデータとったりなどのロジックを挟む。

    const pdfBuilder = createPdfLibTemplateBuilder(
        findPdfFormTemplateBinaryFromBundle,
        findSealImageContentFromGoogleDrive,
        findFontContentFromBundle
    );

    return pdfBuilder(
        PdfTemplateId.ExampleTemplate,
        {
            metaData: input.documentMetadata,
            seals: input.needSeal ? [{
                sealId: process.env.GOOGLE_DRIVE_SEAL_IMPRESSION_FILE_ID || '',
                page: 0,
                position: { x: 420, y: 620 },
                size: { width: 60, height: 60 }
            }] : [],
            fields: {
                // 基本情報
                name: { value: input.name, font: 'ipaexg' },
                no: { value: input.exampleId, font: 'ipaexg' },
                created_at: { value: (() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    return `${year}年${month}月${day}日`;
                })(), font: 'ipaexg' },
                note: { value: input.note || '', font: 'ipaexg' },

                // 項目1
                items1_name: { value: '+ONEチケット', font: 'ipaexg' },
                items1_count: { value: input.quantity.toLocaleString(), font: 'ipaexg' },
                items1_unit_price: { value: '5,000', font: 'ipaexg' },
                items1_price: { value: (5000 * input.quantity).toLocaleString(), font: 'ipaexg' },
                items1_tax_percentage: { value: '10%', font: 'ipaexg' },

                // 項目2
                items2_name: { value: '（特典）+ONEチケット', font: 'ipaexg' },
                items2_count: { value: '1', font: 'ipaexg' },
                items2_unit_price: { value: '0', font: 'ipaexg' },
                items2_price: { value: '0', font: 'ipaexg' },
                items2_tax_percentage: { value: '10%', font: 'ipaexg' },

                // 合計関連計算
                amount_without_tax: { value: (5000 * input.quantity).toLocaleString(), font: 'ipaexg' },
                tax: { value: Math.floor(5000 * input.quantity * 0.1).toLocaleString(), font: 'ipaexg' },
                total: { value: (5000 * input.quantity + Math.floor(5000 * input.quantity * 0.1)).toLocaleString(), font: 'ipaexg' }
            }
        }
    )
}

/**
 * Example2PDFを構築するサービス関数の実装
 * @param input
 * @returns
 */
export const buildExample2PdfTemplate = async (input: {
    value: string,
    documentMetadata?: PdfTemplateDocumentMetadata,
}): Promise<Buffer> => {
    const pdfBuilder = createPdfLibTemplateBuilder(
        findPdfFormTemplateBinaryFromBundle,
        findSealImageContentFromGoogleDrive,
        findFontContentFromBundle
    );

    return pdfBuilder(
        PdfTemplateId.ExampleTemplate2,
        {
            metaData: input.documentMetadata,
            seals: [],
            fields: {
                field1: { value: input.value, font: 'ipaexg' },
                field2: { value: input.value, font: 'ipaexg' },
                field3: { value: input.value, font: 'ipaexg' },
                field4: { value: input.value, font: 'ipaexg' },
                field5: { value: input.value, font: 'ipaexg' },
                field6: { value: input.value, font: 'ipaexg' },
            }
        }
    )
}

