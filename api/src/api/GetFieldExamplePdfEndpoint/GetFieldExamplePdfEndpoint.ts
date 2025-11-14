import { FastifyRequest, FastifyReply } from 'fastify';
import { generateFieldExamplePdf } from '../../domain/FieldExample/FieldExamplePdfService';
import { GetFieldExamplePdfEndpointRequestSchemaType } from './schema';


export const handler = async (request: FastifyRequest<{ Querystring: GetFieldExamplePdfEndpointRequestSchemaType }>, reply: FastifyReply) => {

  const builtPdf = await generateFieldExamplePdf({
    value: request.query.value, // 関連データ取得のためのIDなどを想定
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