import { google } from "googleapis";
import { SealStorage } from "../domain/ports/SealStorage";

export const createGoogleDriveSealStorage = (): SealStorage => ({
    getSeal: async (fileId: string): Promise<Buffer> => {
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
            fileId: fileId,
            alt: 'media',
        }, {
            responseType: 'arraybuffer'
        });

        return Buffer.from(file.data as ArrayBuffer);
    }
});