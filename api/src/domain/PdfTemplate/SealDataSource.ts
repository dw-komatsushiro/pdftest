import { google } from 'googleapis';
/**
 * 印影画像の実態を見つける関数の抽象定義
 */
export type findSealImageContent = (sealId: string) => Promise<Buffer>;

/**
 * 印影画像の実態をGoogleDriveから拾う関数の実装
 * @param sealId
 * @returns 
 */
export const findSealImageContentFromGoogleDrive: findSealImageContent = async (sealId: string): Promise<Buffer> => {
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
    fileId: sealId,
    alt: 'media',
  }, {
    responseType: 'arraybuffer'
  });

  return Buffer.from(file.data as ArrayBuffer);
}

// S3併用とか、開発環境ではバンドルからとかしないといけない場合はここに追加しサービスで定義する
