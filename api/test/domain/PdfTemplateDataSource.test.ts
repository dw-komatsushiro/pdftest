import { PDFDocument } from 'pdf-lib';
import { PdfTemplateId, PdfTemplateMap } from '../../src/domain/PdfTemplate/PdfTemplate';
import { findPdfFormTemplateBinaryFromBundle } from '../../src/domain/PdfTemplate/PdfTemplateDataSource';

describe('PDFTemplateDataSourceTest', () => {

  /**
   * バンドルしているバイナリについて、
   * pdfテンプレートに存在するフォームフィールドと、コード上に定義されているフィールドが一致することを確認する
   */

  // 指定テンプレートのテキストフォームフィールドを抜き出す関数
  const getPdfFormFields = async (pdfBuffer: Buffer): Promise<string[]> => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const form = pdfDoc.getForm();

    return form.getFields()
      .filter(field => field.constructor.name === 'PDFTextField')
      .map(field => field.getName());
  };

  // 型定義からフィールド名を動的に抽出するヘルパー関数
  const createFieldsForTemplate = <T extends PdfTemplateId>(
    templateId: T
  ): Array<keyof PdfTemplateMap[T]> => {
    switch (templateId) {
      case PdfTemplateId.ExampleTemplate:
        // ExampleTemplateの実際のフィールド名
        return [
          'name', 'no', 'created_at', 'note',
          'items1_name', 'items1_count', 'items1_unit_price', 'items1_price', 'items1_tax_percentage',
          'items2_name', 'items2_count', 'items2_unit_price', 'items2_price', 'items2_tax_percentage',
          'amount_without_tax', 'tax', 'total'
        ] as Array<keyof PdfTemplateMap[T]>;
      case PdfTemplateId.ExampleTemplate2:
        // ExampleTemplate2のフィールド名(適当)
        return  ['field1', 'field2', 'field3', 'field4', 'field5', 'field6'] as Array<keyof PdfTemplateMap[T]>;
      default:
        return [] as Array<keyof PdfTemplateMap[T]>;
    }
  };

  // 各テンプレートのフィールドマップを動的に生成
  const TemplateFieldMap: { [key in PdfTemplateId]: Array<keyof PdfTemplateMap[key]> } = {
    [PdfTemplateId.ExampleTemplate]: createFieldsForTemplate(PdfTemplateId.ExampleTemplate),
    [PdfTemplateId.ExampleTemplate2]: createFieldsForTemplate(PdfTemplateId.ExampleTemplate2),
  };

  describe('PDFテンプレート フィールド一致テスト', () => {
    const templateIds: PdfTemplateId[] = [
      PdfTemplateId.ExampleTemplate,
      PdfTemplateId.ExampleTemplate2
    ];

    // 各テンプレートIDに対して動的にテストケースを生成
    templateIds.forEach(templateId => {
      test(`${templateId} のフィールドが型定義と一致する`, async () => {
        const pdfBuffer = await findPdfFormTemplateBinaryFromBundle(templateId);
        const formFields = (await getPdfFormFields(pdfBuffer)).sort();
        const definedFields = TemplateFieldMap[templateId].sort();
        expect(formFields).toEqual(definedFields);
      });
    });
  });
});

