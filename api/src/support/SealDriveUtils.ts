import { google } from 'googleapis'
import {findSealPropertyValues} from "./SerlProperty";


/**
 * 印影専用のドライブオブジェクトの初期設定を行う
 * 印影ドライブの印影ファイルの読み取り以外できない
 * @returns 初期設定情報
 */
const initializeSealDrive = async () => {

    /**
     * 実際は専用の設定テーブルを切り、環境変数(シークレット)から取った複合キーで複合して使用する必要あり
     * 印影データは社内でもアクセス可能者が限定される機密情報のためのアクセス管理に基づきこの対策は必須
     */
    const { serviceAccountKey } = await findSealPropertyValues({serviceAccountKey: 'GOOGLE_SERVICE_ACCOUNT_KEY'});

    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    return google.drive({
        version: 'v3',
        auth,
        timeout: 30 * 60 * 1000,
    });

};

/**
 * Google Driveから指定したファイルIDの印影バイナリを取得する
 * 権限の関係上、エラー時はファイルIDや認証情報をログに出力しない想定
 *
 * @param fileId Google DriveのファイルID
 * @returns ファイルのバイナリデータ
 * @throws 印影データの取得に失敗した場合はエラー（詳細情報はログに出力しない）
 */
export const getFileById = async (fileId: string) => {
    try {
        const drive = await initializeSealDrive();

        return await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, {
            responseType: 'arraybuffer'
        });

    } catch {
        // ファイルIDも認証情報もログに出してはいけない(ログが見れてもアクセス情報をみてはいけない人もいる)
        throw new Error('印影データの取得に失敗しました')
    }
}
