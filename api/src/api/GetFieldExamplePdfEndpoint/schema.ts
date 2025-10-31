import { z } from 'zod';

//　サンプル2
export const GetFieldExamplePdfEndpointRequestSchema = z.object({
  fileName: z.string().describe('ファイル名'),
  value: z.string().describe('テキストフィールドに入れる値')
});

export type GetFieldExamplePdfEndpointRequestSchemaType = z.infer<typeof GetFieldExamplePdfEndpointRequestSchema>;