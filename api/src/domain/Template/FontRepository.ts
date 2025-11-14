import {FontFile} from "./PdfTemplate";

export type getFontFile = (fontId: string) => Promise<FontFile | undefined>;

const FontFiles: FontFile[] = [
    {
        fontId: "ipaexg",
        path: "fonts/ipaexg.ttf",
    },
    {
        fontId: "NotoSansJP",
        path: "fonts/NotoSansJP-Medium.ttf",
    },
]

export const getFontFile: getFontFile = async (fontId: string): Promise<FontFile | undefined> => {
    return FontFiles.find(font => font.fontId === fontId);
}