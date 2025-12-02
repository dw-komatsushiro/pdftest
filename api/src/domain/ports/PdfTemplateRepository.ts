import { PdfTemplateDefinition } from '../Template/PdfTemplate';

export interface PdfTemplateRepository {
    findById(templateId: string): Promise<PdfTemplateDefinition | null>;
}