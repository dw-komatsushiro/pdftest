import { FontRepository } from "../domain/ports/FontRepository";
import { FontFile } from "../domain/Template/PdfTemplate";

const FontFiles: FontFile[] = [
    {
        fontId: "ipaexg",
        path: "fonts/ipaexg.ttf",
    },
    {
        fontId: "NotoSansJP",
        path: "fonts/NotoSansJP-Medium.ttf",
    },
];

export const createInMemoryFontRepository = (): FontRepository => ({
    findById: async (fontId: string): Promise<FontFile | null> => {
        return FontFiles.find(font => font.fontId === fontId) || null;
    }
});