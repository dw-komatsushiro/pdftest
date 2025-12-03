// フォントファイルのバイナリを拾ってくる

import {readFileSync} from "fs";
import {resolve} from "path";

export const loadFontBinary = async (fontName: string): Promise<Buffer> => {
    return readFileSync(resolve(`./assets/fonts/${fontName}.ttf`));
}