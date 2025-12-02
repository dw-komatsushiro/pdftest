import { SealRepository } from "../domain/ports/SealRepository";
import { SealImage } from "../domain/Template/PdfTemplate";

export const createInMemorySealRepository = (): SealRepository => ({
    findById: async (sealId: string): Promise<SealImage | null> => {
        // 実行時に環境変数を読み込む
        const SealImages: SealImage[] = [
            {
                sealId: "seal1",
                path: process.env.GOOGLE_DRIVE_SEAL_IMPRESSION_FILE_ID || '',
            },
        ];

        return SealImages.find(seal => seal.sealId === sealId) || null;
    }
});