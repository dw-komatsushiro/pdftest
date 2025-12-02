import { readFileSync } from "fs";
import { resolve } from "path";
import { TemplateStorage } from "../domain/ports/TemplateStorage";
import { FontStorage } from "../domain/ports/FontStorage";

export const createLocalTemplateStorage = (): TemplateStorage => ({
    getTemplate: async (path: string): Promise<Buffer> => {
        return readFileSync(resolve(`./assets/${path}`));
    }
});

export const createLocalFontStorage = (): FontStorage => ({
    getFont: async (path: string): Promise<Buffer> => {
        return readFileSync(resolve(`./assets/${path}`));
    }
});