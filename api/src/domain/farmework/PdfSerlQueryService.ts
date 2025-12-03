// PDFに捺印する印影バイナリ取得するService

import {getFileById} from "../../support/SealDriveUtils";
import {findSealPropertyValues} from "../../support/SerlProperty";

/**
 * 印影の名前定数
 * 実際はapp_propertyのkeyみたいな用途
 */
export const SealNmae = {
    /** サンプル印影1 別術の理由でテーブル作るの面倒なので環境変数から引いてる*/
    EXAMPLE: 'GOOGLE_DRIVE_SEAL_IMPRESSION_FILE_ID',
    /** サンプル印影2 */
    EXAMPLE2: 'example_seal',
}

/**
 * PDFに捺印する印影のバイナリデータを取得する
 * 指定された印影名に対応するGoogle DriveファイルIDを取得し、
 * Google Drive APIを使用してバイナリデータを取得する
 *
 * @param sealName 印影名（SealNmaeの値を指定）
 * @returns 印影のバイナリデータ
 * @throws 印影データの取得に失敗した場合はエラー
 */
export const findPdfSealBinary = async (sealName: string)=> {
    const { fileId } = await findSealPropertyValues({
        fileId: sealName
    })
    return getFileById(fileId)
}

/**
 * 印影のバイナリデータをBase64形式のData URIに変換する
 *
 * @param binary 印影のバイナリデータ
 * @returns Base64エンコードされたData URI（data:image/png;base64,...形式）
 */
export const convertSealBinaryToBase64 = (binary: Buffer): string => {
    return `data:image/png;base64,${binary.toString('base64')}`
}