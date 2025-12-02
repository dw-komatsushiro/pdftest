import { FontFile } from '../Template/PdfTemplate';

export interface FontRepository {
    findById(fontId: string): Promise<FontFile | null>;
}