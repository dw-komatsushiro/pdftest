import { Template } from "@pdfme/common"
import {generate} from "@pdfme/generator";
import {loadFontBinary} from "../../support/FontService";
import {image, multiVariableText, text} from "@pdfme/schemas";

//テンプレートからPDFを生成するサービス

// どの入力欄を何に置換するかの情報を持つ
interface PdfInfo {
    /** ファイルタイトル **/
    title: string;

    /** フィールド値情報 */
    // 画像はbase64文字列。印影も通常プロパティと同様に渡す
    // 事前にページを割ってる場合はページ単位でフィールド設定
    fieldReplaceMap: Record<string, string>[];

}

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

