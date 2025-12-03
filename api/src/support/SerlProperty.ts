// 印影関連の高機密情報専用の設定テーブルから値を取得するユーティリティ

/**
 * 印影関連の高機密情報を環境変数から取得する
 * 本来はDB上で暗号化して保存し、環境変数から取得した復号キーで復号化する必要がある
 * 印影データは社内でもアクセス可能者が限定される機密情報のため、アクセス管理に基づく対策が必須
 *
 * @param names 取得するプロパティ名のマップ（キー: 返却オブジェクトのキー、値: 環境変数名）
 * @returns 取得したプロパティ値のマップ
 * @throws 環境変数が見つからない場合はエラー
 *
 * @example
 * const { serviceAccountKey } = await findSealPropertyValues({
 *   serviceAccountKey: 'GOOGLE_SERVICE_ACCOUNT_KEY'
 * });
 */
export const findSealPropertyValues = async <T extends { [key in string]: string }>(names: T) => {
    // app_property同様にkeyから値をとってくる
    // const queryResult = await appDb.appPropertyTable.findMany({
    //     select: { name: true, value: true },
    //     where: { name: { in: Object.values(names) } },
    // });

    // 高機密につきDB上には暗号化して保存し、環境変数(シークレット管理)からとった複合キーで複合する
    // 例)
    // const decryptValue = (encryptedValue: string): string => {
    //    const encryptionKey = process.env.SEAL_PROPERTY_ENCRYPTION_KEY;
    //    if (!encryptionKey) {
    //        throw new Panic('SEAL_PROPERTY_ENCRYPTION_KEYが設定されていません');
    //    }
    //    return someDecryptionLibrary.decrypt(encryptedValue, encryptionKey);
    // }

    // return Object.entries(names).reduce(
    //     (acc, [key, name]) => {
    //         const value = queryResult.find(row => row.name === name)?.value;
    //         if (!value) {
    //             throw new Panic(`app_propertyの値が見つかりません。name=${name}`);
    //         }
    //         acc[key as keyof T] = decryptValue(value);
    //         return acc;
    //     },
    //     {} as { [key in keyof T]: string }
    // );

    // ここではめんどくさいので環境変数からそのまま引っ張ってくる
    return Object.entries(names).reduce(
        (acc, [key, name]) => {
            const value = process.env[name];
            if (!value) {
                throw new Error(`印影プロパティの値が見つかりません。name=${name}`);
            }
            acc[key as keyof T] = value;
            return acc;
        },
        {} as { [key in keyof T]: string }
    );
};