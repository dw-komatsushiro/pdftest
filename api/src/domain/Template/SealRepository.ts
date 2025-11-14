import {SealImage} from "./PdfTemplate";

export type getSealImage = (sealId: string) => Promise<SealImage | undefined>;

export const getSealImage: getSealImage = async (sealId: string): Promise<SealImage | undefined> => {
    // 実行時に環境変数を読み込む
    const SealImages: SealImage[] = [
        // ここに印影の定義が入る(念のため複数を想定)
        {
            sealId: "seal1",
            path: process.env.GOOGLE_DRIVE_SEAL_IMPRESSION_FILE_ID || '',
        },
    ];

    return SealImages.find(seal => seal.sealId === sealId);
}