// どこからかバイナリを取ってくるサービス

// 抽象定義
export type getBinary = (path: string) => Promise<Buffer>;

/** --- ファイル分けたい --- **/

import {readFileSync} from "fs";
import {resolve} from "path";
// アセットから取ってくる実装
export const getBinaryFromAsset: getBinary = async (path: string): Promise<Buffer> => {
    return readFileSync(resolve(`./assets/${path}`));
}

/** --- ファイル分けたい --- **/

import {google} from "googleapis";
// 印影用の認証情報でGoogleDriveから取ってくる実装
export const getBinaryFromGoogleDrive: getBinary = async (path: string): Promise<Buffer> => {
    // 環境変数からサービスアカウントキーを取得
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        throw new Error('Google Service Account Key not found in environment variables');
    }

    // サービスアカウント認証
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    // Google Drive API クライアント
    const drive = google.drive({ version: 'v3', auth });
    // ファイルを直接取得
    const file = await drive.files.get({
        fileId: path,
        alt: 'media',
    }, {
        responseType: 'arraybuffer'
    });

    return Buffer.from(file.data as ArrayBuffer);
}