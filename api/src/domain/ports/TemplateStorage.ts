export interface TemplateStorage {
    getTemplate(path: string): Promise<Buffer>;
}