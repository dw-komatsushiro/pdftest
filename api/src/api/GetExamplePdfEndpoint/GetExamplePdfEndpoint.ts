import { FastifyRequest, FastifyReply } from 'fastify';
import { generatePlusOnePdf } from '../../domain/PlusOne/PlusOnePdfService';
import { GetExamplePdfEndpointRequestSchemaType } from './schema';


export const handler = async (request: FastifyRequest<{ Querystring: GetExamplePdfEndpointRequestSchemaType }>, reply: FastifyReply) => {

  // Note: 署名付きURLの発行機能が必要となるため、別途の実装に合わせてトークンベースで返せるようにする必要あるため注意

  const builtPdf = await generatePlusOnePdf({
    exampleId: request.query.dataId, // 関連データ取得のためのIDなどを想定
    needSeal: request.query.withSeal ?? false,
    name: request.query.name, // 宛名
    note: request.query.note, // 備考
    quantity: request.query.quantity, // 枚数
    documentMetadata: {
      title: request.query.fileName,
    }
  });

  const baseName = request.query.fileName;
  const originalFileName = `${baseName}.pdf`;
  const encodedFileName = encodeURIComponent(originalFileName);
  reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName};`)
      .send(builtPdf);
  return reply;
};
