// plusOneのPDF生成サービス

import {buildPdfGenerator} from "../Template/GeneratePdfService";
import {getPdfTemplate} from "../Template/PdfTemplateRepository";
import {getSealImage} from "../Template/SealRepository";
import {getBinaryFromAsset, getBinaryFromGoogleDrive} from "../Template/BinaryService";
import {getGenerator} from "../Template/PdfGenerator";
import {getFontFile} from "../Template/FontRepository";

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
    const pdfGenerator = buildPdfGenerator (
        getPdfTemplate,
        getBinaryFromAsset,
        getSealImage,
        getBinaryFromGoogleDrive,
        getFontFile,
        getBinaryFromAsset,
        getGenerator,
    );

    // データ取ってきてはめる
    return pdfGenerator(
        "example_me",
        {
            metaData: input.documentMetadata,
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
        },
        (input.needSeal ?['seal1']: [])
    )
}