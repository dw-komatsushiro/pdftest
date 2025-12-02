export interface FontStorage {
    getFont(path: string): Promise<Buffer>;
}