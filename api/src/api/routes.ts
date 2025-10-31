import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import * as GetExamplePdfEndpoint from './GetExamplePdfEndpoint/GetExamplePdfEndpoint';
import * as GetExample2PdfEndpoint from './GetFieldExamplePdfEndpoint/GetFieldExamplePdfEndpoint';

export const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const { prefix } = fastify;
  fastify.zod.get(
    `${prefix}/pdf`,
    {
      operationId: 'pdfDocument',
      querystring: 'GetExamplePdfEndpointRequestSchema',
      tags: ['PDF'],
      description: '実例に近いPDFドキュメントを作って返すサンプルです',
    },
    GetExamplePdfEndpoint.handler
  );
  fastify.zod.get(
    `${prefix}/field_pdf`,
    {
      operationId: 'pdf2Document',
      querystring: 'GetFieldExamplePdfEndpointRequestSchema',
      tags: ['PDF'],
      description: 'テキストフィールドの設定ごとの挙動を見るためのサンプルです',
    },
    GetExample2PdfEndpoint.handler
  );
};
