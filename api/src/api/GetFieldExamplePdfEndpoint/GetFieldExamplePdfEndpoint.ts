import { FastifyRequest, FastifyReply } from 'fastify';
import { buildExample2PdfTemplate } from '../../domain/PdfTemplate/PdfTemplateService';
import { GetFieldExamplePdfEndpointRequestSchemaType } from './schema';


export const handler = async (request: FastifyRequest<{ Querystring: GetFieldExamplePdfEndpointRequestSchemaType }>, reply: FastifyReply) => {

  const builtPdf = await buildExample2PdfTemplate({
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