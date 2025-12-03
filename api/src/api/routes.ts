import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import * as GetExamplePdfEndpoint from './GetExamplePdfEndpoint/GetExamplePdfEndpoint';

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
};
