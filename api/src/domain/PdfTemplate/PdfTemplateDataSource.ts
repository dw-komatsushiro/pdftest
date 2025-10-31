// テンプレート情報はバイナリに紐づくドメイン情報として管理する想定のためハードコードで定義

import { read, readFileSync } from "fs";
import { PdfTemplateId } from "./PdfTemplate";
import { resolve } from "path";

/**
 * pdfテンプレートの実態を見つける関数の抽象定義
 * pdf生成のためのテンプレート自体は pdfformを持つpdfバイナリ でなくなる可能性を想定しunknownで定義
 */
export type findPdfTemplateContent = (templateId: PdfTemplateId) => Promise<unknown>;

export type findPdfFormTemplateBinary = (templateId: PdfTemplateId) => Promise<Buffer>;
/**
 * PDFフォームテンプレートのバイナリデータをバンドルから拾う関数の実装
 * @param templateId 
 * @returns 
 */
export const findPdfFormTemplateBinaryFromBundle: findPdfFormTemplateBinary = async (templateId: PdfTemplateId): Promise<Buffer> => {
  return readFileSync(resolve(`./assets/pdfTemplates/${templateId}.pdf`));
}
