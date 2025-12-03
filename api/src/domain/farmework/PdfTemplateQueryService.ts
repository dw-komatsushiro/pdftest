import { Template } from "@pdfme/common"
import {readFileSync} from "fs";
import {resolve} from "path";

/**
 * PDFテンプレートの種別
 * 各種証明書や領収書などのテンプレートタイプを定義
 */
export enum PdfTemplateType {
    /** +One領収書 */
    PLUS_ONE = 'template',
    /** 成績証明書 */
    EXAMPLE_1 = 'example',
    /** 卒業証明書 */
    EXAMPLE_2 = 'example2',
}

/**
 * PDFテンプレートを取得する
 * 指定されたテンプレートタイプに対応するJSONファイルを読み込んで返す
 *
 * @param templateType 取得するPDFテンプレートの種別
 * @returns @pdfme/common形式のテンプレートオブジェクト
 * @throws テンプレートファイルが存在しない場合はエラー
 *
 * @remarks
 * - PDFテンプレートはJSON形式で保存されている
 * - コード上で0から定義することも可能
 * - ファイルパス: ./assets/pdfTemplates/${templateType}.json
 */
export const findPdfTemplate = async (templateType: PdfTemplateType):Promise<Template> => {
    // PDFテンプレートを読み込んでテンプレートJSONを返すサービス
    // PdfMeのテンプレートはJSON形式なので基本は読み込んでそのまま返すが、コード上で0から定義しても差し支えはない
    const template_str =  readFileSync(resolve(`./assets/pdfTemplates/${templateType}.json`)).toString();
    return JSON.parse(template_str.toString()) as Template;
}