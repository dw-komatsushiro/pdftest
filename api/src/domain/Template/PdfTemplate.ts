import {PdfTemplateGeneratorType} from "./PdfGenerator";

export interface PdfTemplateDefenition {
    readonly templateId: string;
    readonly inputFields: ReadonlyArray<PdfTemplateFieldDefinition>;
    readonly sealPositions: ReadonlyArray<PdfTemplateSealDefinition>;
    readonly sourcePath: string;
    readonly generatorType: PdfTemplateGeneratorType;
}

export interface PdfTemplateFieldDefinition {
    fieldId: string
    font?: string
}

export interface PdfTemplateSealDefinition {
    dealDefinitionId: string
    sealId: string
    // テンプレ側で指定できる場合はしなくていいこともありそう
    page?: number
    size?: {
        width: number
        height: number
    }
    position?: {
        x: number
        y: number
    }
}

export interface SealImage {
    sealId: string;
    path: string;
}

export interface FontFile {
    fontId: string;
    path: string;
}

