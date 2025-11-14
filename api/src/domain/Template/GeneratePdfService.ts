import {getPdfTemplate} from "./PdfTemplateRepository";
import {getSealImage} from "./SealRepository";
import {getBinary} from "./BinaryService";
import {getGenerator} from "./PdfGenerator";
import {getFontFile} from "./FontRepository";

export const buildPdfGenerator = (
    templateRepository: getPdfTemplate,
    templateBinaryService: getBinary,
    sealRepository: getSealImage,
    sealBinaryService: getBinary,
    fontRepository: getFontFile,
    fontBinaryService: getBinary,
    generatorFactory: getGenerator,
) => async (
    templateId: string,
    inputData: Record<string, any>,
    requiredStamps: Array<string>,
) => {

    // 指定されたテンプレを取得
    const templateDef = await templateRepository(templateId);
    if (!templateDef) {
        throw new Error(`Template not found: ${templateId}`);
    }

    // 各バイナリを取得
    const templateBinary = await templateBinaryService(templateDef.sourcePath);

    const sealBinaries: Record<string, Buffer> = {};
    for (const sealId of requiredStamps) {
        if (sealBinaries[sealId]) continue
        const sealImage = await sealRepository(sealId)
        if (!sealImage) throw new Error(`Seal not found: ${sealId}`);
        try {
            sealBinaries[sealId] = await sealBinaryService(sealImage.path);
        } catch (e) {
            throw new Error(`Seal Binary not found: ${sealImage.path} ${JSON.stringify(sealImage)}`);
        }

    }

    const fontBinaries: Record<string, Buffer> = {};
    for (const fieldDef of templateDef.inputFields) {
        if (!fieldDef.font) continue;
        if (fontBinaries[fieldDef.font]) continue;
        const fontFile = await fontRepository(fieldDef.font);
        if(!fontFile) throw new Error(`Font not found: ${fieldDef.font}`);
        fontBinaries[fieldDef.font] = await fontBinaryService(fontFile.path);
    }

    const PdfGenerator = generatorFactory(templateDef.generatorType);

    return await PdfGenerator(
        templateBinary,
        sealBinaries,
        fontBinaries,
        {
            templateId: templateId,
            fieldValues: inputData,
            requiredStamps: requiredStamps,
        },
        templateDef
    );

}