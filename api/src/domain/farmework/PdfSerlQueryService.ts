// PDFに捺印する印影バイナリ取得するService

import {getFileById} from "../../support/SealDriveUtils";
import {findSealPropertyValues} from "../../support/SerlProperty";

// 印影専用設定テーブルのキーを持っておくValueObject想定
export const SealNmae = {
    EXAMPLE: 'GOOGLE_DRIVE_SEAL_IMPRESSION_FILE_ID',
    EXAMPLE2: 'example_seal',
}

export const findPdfSealBinary = async (sealName: string)=> {
    const { fileId } = await findSealPropertyValues({
        fileId: sealName
    })
    return getFileById(fileId)
}

export const convertSealBinaryToBase64 = (binary: Buffer): string => {
    return `data:image/png;base64,${binary.toString('base64')}`
}