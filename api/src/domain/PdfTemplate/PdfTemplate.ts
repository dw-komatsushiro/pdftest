// PDFビルダーに投げるビルドに必要な情報 を指して PDFTemplate の型。

/**
 * PDFテンプレートのベース型定義
 * 文字の埋め込み位置はテンプレートに事前規定、印影は作成時に指定位置に埋め込みする前提
 */
export interface PdfTemplate {
  metaData?: PdfTemplateDocumentMetadata; // PDFドキュメントメタデータ情報（指定しない場合テンプレートそのまま）
  seals: SealTemplate[]; // 捺印データ(あれば)
  fields: { [key: string]: PdfTemplateTextField }; // その他テンプレート固有のフィールド
}

export interface PdfTemplateDocumentMetadata {
  title?: string; // PDFドキュメントのタイトル
  author?: string; // PDFドキュメントの著者
  subject?: string; // PDFドキュメントのサブジェクト
  keywords?: string[]; // PDFドキュメントのキーワード
  creator?: string; // PDFドキュメントのクリエイター
  producer?: string; // PDFドキュメントのプロデューサー
}

/**
 * PDFテンプレートの文字埋め込みフィールド定義
 */
export interface PdfTemplateTextField {
  value: string; // 埋め込む文字列
  font?: string; // 使用したいフォント
}

/**
 * 印影テンプレート定義
 */
export interface SealTemplate {
  sealId: string; // 印影のID
  page: number; // 捺印するページ番号(0~)
  position: { x: number; y: number }; // PDF内の捺印位置
  size: { width: number; height: number }; // 印影のサイズ
}

export const enum PdfTemplateId {
  ExampleTemplate = 'example',
  ExampleTemplate2 = 'example2',
}

export type PdfTemplateMap= {
  [PdfTemplateId.ExampleTemplate]: ExampleTemplate;
  [PdfTemplateId.ExampleTemplate2]: ExampleTemplate2;
};

// 具体的なテンプレートの型情報
export interface ExampleTemplate extends PdfTemplate {
  fields: {
    name: { value: string; font?: 'ipaexg'; }; // 宛名
    no: { value: string; font?: 'ipaexg'; }; // 請求書番号
    created_at: { value: string; font?: 'ipaexg'; }; // 作成日
    note: { value: string; font?: 'ipaexg'; }; // 備考

    // 項目1
    items1_name: { value: string; font?: 'ipaexg'; }; // 項目名1
    items1_count: { value: string; font?: 'ipaexg'; }; // 数量1
    items1_unit_price: { value: string; font?: 'ipaexg'; }; // 単価1
    items1_price: { value: string; font?: 'ipaexg'; }; // 金額1
    items1_tax_percentage: { value: string; font?: 'ipaexg'; }; // 税率1

    // 項目2
    items2_name: { value: string; font?: 'ipaexg'; }; // 項目名2
    items2_count: { value: string; font?: 'ipaexg'; }; // 数量2
    items2_unit_price: { value: string; font?: 'ipaexg'; }; // 単価2
    items2_price: { value: string; font?: 'ipaexg'; }; // 金額2
    items2_tax_percentage: { value: string; font?: 'ipaexg'; }; // 税率2

    // 合計関連
    amount_without_tax: { value: string; font?: 'ipaexg'; }; // 税抜金額
    tax: { value: string; font?: 'ipaexg'; }; // 税額
    total: { value: string; font?: 'ipaexg'; }; // 合計金額
  };
}

// 具体的なテンプレートの型情報2
export interface ExampleTemplate2 extends PdfTemplate {
  fields: {
    field1: { value: string; font?: 'ipaexg'; };
    field2: { value: string; font?: 'ipaexg'; };
    field3: { value: string; font?: 'ipaexg'; };
    field4: { value: string; font?: 'ipaexg'; };
    field5: { value: string; font?: 'ipaexg'; };
    field6: { value: string; font?: 'ipaexg'; };
  };
}

