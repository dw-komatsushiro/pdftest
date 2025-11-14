import {PdfTemplateDefenition, FontFile} from "./PdfTemplate";
import {PdfTemplateGeneratorType} from "./PdfGenerator";


export type getPdfTemplate = (templateId: string) => Promise<PdfTemplateDefenition | null>;


const Templates: PdfTemplateDefenition[] = [
    /// ここにテンプレートの定義が入る
    {
        templateId: "example2",
        inputFields: [
            { fieldId: 'field1', font: "ipaexg" },
            { fieldId: 'field2', font: "ipaexg" },
            { fieldId: 'field3', font: "ipaexg" },
            { fieldId: 'field4', font: "ipaexg" },
            { fieldId: 'field5', font: "ipaexg" },
            { fieldId: 'field6', font: "ipaexg" },
        ],
        sealPositions: [
            {
                sealId: 'seal1',
                page: 0,
                position: { x: 420, y: 620 },
                size: { width: 60, height: 60 }
            },
        ],
        sourcePath: "pdfTemplates/example2.pdf",
        generatorType: PdfTemplateGeneratorType.PDF_LIB_WITH_FORM,
    },
    {
        templateId: "example",
        inputFields: [
            {fieldId: "name", font: "ipaexg"},
            {fieldId: "no", font: "ipaexg"},
            {fieldId: "created_at", font: "ipaexg"},
            {fieldId: "note", font: "ipaexg"},
            {fieldId: "items1_name", font: "ipaexg"},
            {fieldId: "items1_count", font: "ipaexg"},
            {fieldId: "items1_unit_price", font: "ipaexg"},
            {fieldId: "items1_price", font: "ipaexg"},
            {fieldId: "items1_tax_percentage", font: "ipaexg"},
            {fieldId: "items2_name", font: "ipaexg"},
            {fieldId: "items2_count", font: "ipaexg"},
            {fieldId: "items2_unit_price", font: "ipaexg"},
            {fieldId: "items2_price", font: "ipaexg"},
            {fieldId: "items2_tax_percentage", font: "ipaexg"},
            {fieldId: "amount_without_tax", font: "ipaexg"},
            {fieldId: "tax", font: "ipaexg"},
            {fieldId: "total", font: "ipaexg"},
        ],
        sealPositions: [
            {
                sealId: 'seal1',
                page: 0,
                position: { x: 420, y: 620 },
                size: { width: 60, height: 60 }
            },
        ],
        sourcePath: "pdfTemplates/example.pdf",
        generatorType: PdfTemplateGeneratorType.PDF_LIB_WITH_FORM,
    },
    {
        templateId: "example_me",
        inputFields: [
            {fieldId: "name", font: "NotoSansJP"},
            {fieldId: "no", font: "NotoSansJP"},
            {fieldId: "created_at", font: "NotoSansJP"},
            {fieldId: "note", font: "NotoSansJP"},
            {fieldId: "items1_name", font: "NotoSansJP"},
            {fieldId: "items1_count", font: "NotoSansJP"},
            {fieldId: "items1_unit_price", font: "NotoSansJP"},
            {fieldId: "items1_price", font: "NotoSansJP"},
            {fieldId: "items1_tax_percentage", font: "NotoSansJP"},
            {fieldId: "items2_name", font: "NotoSansJP"},
            {fieldId: "items2_count", font: "NotoSansJP"},
            {fieldId: "items2_unit_price", font: "NotoSansJP"},
            {fieldId: "items2_price", font: "NotoSansJP"},
            {fieldId: "items2_tax_percentage", font: "NotoSansJP"},
            {fieldId: "amount_without_tax", font: "NotoSansJP"},
            {fieldId: "tax", font: "NotoSansJP"},
            {fieldId: "total", font: "NotoSansJP"},
        ],
        sealPositions: [
            {
                sealId: 'seal1',
            },
        ],
        sourcePath: "pdfTemplates/template.json",
        generatorType: PdfTemplateGeneratorType.PDFME,
    }
]
export const getPdfTemplate: getPdfTemplate = async (templateId: string): Promise<PdfTemplateDefenition | null> => {
    return Templates.find(template => template.templateId === templateId) || null;
}


