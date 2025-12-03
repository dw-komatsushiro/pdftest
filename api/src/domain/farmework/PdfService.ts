import { Template } from "@pdfme/common"
import {generate} from "@pdfme/generator";
import {loadFontBinary} from "../../support/FontService";
import {image, multiVariableText, text} from "@pdfme/schemas";

//テンプレートからPDFを生成するサービス

/**
 * PDF生成に必要な情報
 * テンプレートのどの入力欄を何に置換するかを定義する
 */
interface PdfInfo {
    /** ファイルタイトル */
    title: string;

    /** フィールド値情報（ページごとの置換マップ）
     * - 画像はbase64文字列で指定
     * - 印影も通常プロパティと同様に渡す
     * - 事前にページを割っている場合はページ単位でフィールドを設定
     */
    fieldReplaceMap: Record<string, string>[];

}

/**
 * PDFテンプレートからPDFを生成する
 * テンプレートで使用されているフォントを自動的に読み込み、フィールド値を置換してPDFを生成する
 *
 * @param PdfInfo PDF生成に必要な情報（タイトル、フィールド値）
 * @param PdfTemplate PDFテンプレート（@pdfme/common形式）
 * @returns 生成されたPDFのバイナリデータ
 * @throws PDF生成に失敗した場合はエラー
 *
 * @remarks
 * - テンプレートで指定されたフォントを並列で読み込む
 * - 最初のフォントがフォールバックフォントとして設定される
 * - text, image, multiVariableTextプラグインに対応
 */
export const generatePdf = async (
    PdfInfo: PdfInfo,
    PdfTemplate: Template
): Promise<Buffer> => {

    // テンプレートで使用しているフォントを列挙して登録する
    const fontNames = PdfTemplate.schemas
        .flat()
        .filter(schema => !!schema.fontName)
        .map(schema => schema.fontName as string)
        .filter((value, index, self) => self.indexOf(value) === index); // 重複排除

    const fontBuffers = await Promise.all(
        fontNames.map(fontName => loadFontBinary(fontName))
    );

    const fonts: Record<string, { data: Uint8Array<ArrayBuffer>; fallback: boolean }> = {};
    fontNames.forEach((fontName, index) => {
        fonts[fontName] = {
            data: new Uint8Array(fontBuffers[index]),
            fallback: index === 0 // 最初のフォントをfallbackに設定
        };
    });
    console.error('Loaded fonts:', Object.keys(fonts));

    try {
        const pdf = await generate({
            template: PdfTemplate,
            inputs: PdfInfo.fieldReplaceMap,
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

