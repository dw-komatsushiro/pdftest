// plusOneのPDF生成サービス


import {generatePdf} from "../farmework/PdfService";
import {findPdfTemplate, PdfTemplateType} from "../farmework/PdfTemplateQueryService";
import {convertSealBinaryToBase64, findPdfSealBinary, SealNmae} from "../farmework/PdfSerlQueryService";

interface PlusOnePdfInput {
    exampleId: string;
    needSeal: boolean;
    name: string;
    note?: string;
    quantity: number;
    documentMetadata: {
        title: string;
    };
}

export const generatePlusOnePdf = async (input: PlusOnePdfInput): Promise<Buffer> =>  {

    const Template = await findPdfTemplate(PdfTemplateType.PLUS_ONE)

    // データ取ってきてはめる処理などをする。

    return generatePdf(
        {
            title: input.documentMetadata.title,
            fieldReplaceMap: [{
                // 印影が要る場合
                ...(input.needSeal ?{
                    seal_seal1: convertSealBinaryToBase64(Buffer.from((await findPdfSealBinary(SealNmae.EXAMPLE)).data as ArrayBuffer))
                }: {}),

                // 基本情報
                name: input.name,
                no: input.exampleId,
                created_at: (() => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = String(now.getMonth() + 1).padStart(2, '0');
                    const day = String(now.getDate()).padStart(2, '0');
                    return `${year}年${month}月${day}日`;
                })(),
                note: input.note || '',

                // 項目1
                items1_name: '+ONEチケット',
                items1_count: input.quantity.toLocaleString(),
                items1_unit_price: '5,000',
                items1_price: (5000 * input.quantity).toLocaleString(),
                items1_tax_percentage: '10%',

                // 項目2
                items2_name: '（特典）+ONEチケット',
                items2_count: '1',
                items2_unit_price: '0',
                items2_price: '0',
                items2_tax_percentage: '10%',

                // 合計関連計算
                amount_without_tax: (5000 * input.quantity).toLocaleString(),
                tax: Math.floor(5000 * input.quantity * 0.1).toLocaleString(),
                total: (5000 * input.quantity + Math.floor(5000 * input.quantity * 0.1)).toLocaleString()
            }]
        },
        Template
    )
}