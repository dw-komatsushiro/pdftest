import { SealImage } from '../Template/PdfTemplate';

export interface SealRepository {
    findById(sealId: string): Promise<SealImage | null>;
}