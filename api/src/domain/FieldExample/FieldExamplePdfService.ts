// FieldExampleのPDF生成サービス
// @deprecated このファイルは旧実装です

import {buildPdfGenerator} from "../Template/GeneratePdfService";
import {getPdfTemplate} from "../Template/PdfTemplateRepository";
import {getSealImage} from "../Template/SealRepository";
import {getBinaryFromAsset, getBinaryFromGoogleDrive} from "../Template/BinaryService";
import {getGenerator, PdfTemplateGeneratorType} from "../Template/PdfGenerator";
import {getFontFile} from "../Template/FontRepository";

interface FieldExamplePdfInput {
    value: string;
    documentMetadata: {
        title: string;
    };
}

// 旧実装用のadapter
const createRepositoryAdapter = <T extends (...args: any[]) => any>(fn: T) => ({
    findById: fn
});

const createStorageAdapter = <T extends (...args: any[]) => any>(fn: T, methodName: 'getTemplate' | 'getSeal' | 'getFont') => ({
    [methodName]: fn
});

export const generateFieldExamplePdf = async (input: FieldExamplePdfInput): Promise<Buffer> =>  {
    const pdfGenerator = buildPdfGenerator (
        createRepositoryAdapter(getPdfTemplate),
        createStorageAdapter(getBinaryFromAsset, 'getTemplate') as any,
        createRepositoryAdapter(getSealImage),
        createStorageAdapter(getBinaryFromGoogleDrive, 'getSeal') as any,
        createRepositoryAdapter(getFontFile),
        createStorageAdapter(getBinaryFromAsset, 'getFont') as any,
        getGenerator,
    );

    // データ取ってきてはめる
    return pdfGenerator(
        "example2",
        {
            field1: input.value,
            field2: input.value,
            field3: input.value,
            field4: input.value,
            field5: input.value,
            field6: input.value,
        },
        []
    )
}