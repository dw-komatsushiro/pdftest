export interface SealStorage {
    getSeal(path: string): Promise<Buffer>;
}