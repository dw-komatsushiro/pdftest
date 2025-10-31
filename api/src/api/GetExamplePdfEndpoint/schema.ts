import { z } from 'zod';

//　サンプル
export const GetExamplePdfEndpointRequestSchema = z.object({
  fileName: z.string().describe('ファイル名'),
  dataId: z.string().describe('実際多分こんな用法の例(PDFのIDのところに使う)'),
  withSeal: z.boolean().optional().describe('押印有無'),
  name: z.string().describe('宛名'),
  note: z.string().optional().describe('備考'),
  quantity: z.number().min(1).describe('枚数')
});

export type GetExamplePdfEndpointRequestSchemaType = z.infer<typeof GetExamplePdfEndpointRequestSchema>;