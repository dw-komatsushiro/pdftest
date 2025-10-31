import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * フォントファイルの実態を見つける関数の抽象定義
 */
export type findFontContent = (fontName: string) => Promise<Buffer>;

/**
 * フォントファイルの実態をバンドルから拾う関数の実装
 * @param fontName
 * @returns 
 */
export const findFontContentFromBundle: findFontContent = async (fontName: string): Promise<Buffer> => {
  return readFileSync(resolve(`./assets/fonts/${fontName}.ttf`));
}


