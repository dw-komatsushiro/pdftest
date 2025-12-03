// フォントファイルのバイナリを拾ってくる

import {readFileSync} from "fs";
import {resolve} from "path";

/**
 * フォントファイルのバイナリデータを読み込む
 * @param fontName フォント名（拡張子なし）
 * @returns フォントファイルのバイナリデータ
 * @throws ファイルが存在しない場合はエラー
 */
export const loadFontBinary = async (fontName: string): Promise<Buffer> => {
    return readFileSync(resolve(`./assets/fonts/${fontName}.ttf`));
}