import { GeneratePdf } from "../../domain/Template/GeneratePdfService";
import { PdfFieldValues } from "../../domain/Template/PdfTemplate";

export interface PlusOnePdfInput {
    readonly exampleId: string;
    readonly needSeal: boolean;
    readonly name: string;
    readonly note?: string;
    readonly quantity: number;
    readonly documentMetadata?: {
        readonly title?: string;
    };
}

// Value Objectとしてデータ変換ロジックを切り出し
const createPlusOnePdfData = (input: PlusOnePdfInput): PdfFieldValues => {
    const quantity = input.quantity;
    const subtotal = 5000 * quantity;
    const tax = Math.floor(subtotal * 0.1);
    const total = subtotal + tax;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const createdAt = `${year}年${month}月${day}日`;

    return {
        // 基本情報
        name: input.name,
        no: input.exampleId,
        created_at: createdAt,
        note: input.note || '',

        // 項目1
        items1_name: '+ONEチケット',
        items1_count: quantity.toLocaleString(),
        items1_unit_price: '5,000',
        items1_price: subtotal.toLocaleString(),
        items1_tax_percentage: '10%',

        // 項目2
        items2_name: '（特典）+ONEチケット',
        items2_count: '1',
        items2_unit_price: '0',
        items2_price: '0',
        items2_tax_percentage: '10%',

        // 合計関連計算
        amount_without_tax: subtotal.toLocaleString(),
        tax: tax.toLocaleString(),
        total: total.toLocaleString(),
    };
};

export type GeneratePlusOnePdfUseCase = (input: PlusOnePdfInput) => Promise<Buffer>;

export const createGeneratePlusOnePdfUseCase = (
    pdfGenerator: GeneratePdf
): GeneratePlusOnePdfUseCase => {
    return async (input: PlusOnePdfInput): Promise<Buffer> => {
        const fieldValues = createPlusOnePdfData(input);
        const requiredStamps = input.needSeal ? ['seal1'] : [];

        return pdfGenerator(
            "example_me",
            fieldValues,
            requiredStamps
        );
    };
};