// Dependency Injection Container (関数型)

import { buildPdfGenerator } from "../domain/Template/GeneratePdfService";
import { getGenerator } from "../domain/Template/PdfGenerator";
import { createInMemoryPdfTemplateRepository } from "../infrastructure/InMemoryPdfTemplateRepository";
import { createLocalTemplateStorage, createLocalFontStorage } from "../infrastructure/LocalFileStorage";
import { createGoogleDriveSealStorage } from "../infrastructure/GoogleDriveSealStorage";
import { createInMemorySealRepository } from "../infrastructure/InMemorySealRepository";
import { createInMemoryFontRepository } from "../infrastructure/InMemoryFontRepository";
import { createGeneratePlusOnePdfUseCase, GeneratePlusOnePdfUseCase } from "../application/usecases/GeneratePlusOnePdfUseCase";

// UseCasesの型定義
export interface UseCases {
    generatePlusOnePdf: GeneratePlusOnePdfUseCase;
}

// DIコンテナの構築
export const buildUseCases = (): UseCases => {
    // Infrastructure層のインスタンス作成
    const pdfTemplateRepository = createInMemoryPdfTemplateRepository();
    const templateStorage = createLocalTemplateStorage();
    const sealRepository = createInMemorySealRepository();
    const sealStorage = createGoogleDriveSealStorage();
    const fontRepository = createInMemoryFontRepository();
    const fontStorage = createLocalFontStorage();

    // Domain層のサービス構築
    const pdfGenerator = buildPdfGenerator(
        pdfTemplateRepository,
        templateStorage,
        sealRepository,
        sealStorage,
        fontRepository,
        fontStorage,
        getGenerator
    );

    // Application層のUseCase構築
    return {
        generatePlusOnePdf: createGeneratePlusOnePdfUseCase(pdfGenerator),
    };
};