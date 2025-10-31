import fs from 'fs';
import fastify, { FastifyInstance } from 'fastify';
import { FastifySchemaValidationError } from 'fastify/types/schema';
import { FastifyZod, buildJsonSchemas, register } from 'fastify-zod';
import { routes } from '../api/routes';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// 他のソースファイルで環境変数を参照するためインポート前に環境変数を読み込み
dotenv.config({ path: '.env.local' });

import { models } from './models';

const HOST_ADDRESS = '0.0.0.0';
const PORT = 8088;

declare module 'fastify' {
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof models>;
  }
}

const main = async () => {
  const isDev = process.env.NODE_ENV !== 'production';
  // TODO 適切なログレベルに修正する
  const server = fastify({
    logger: { level: 'warn' },
    //exampleプロパティがjsonスキーマにあるとエラーとなり起動できなくなってしまうのでログ出力のみに抑制する
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['example'],
      },
    },
    trustProxy: true,
  });

  const jsonSchemas = buildJsonSchemas(models);

  await register(server, {
    jsonSchemas: jsonSchemas,
    swaggerOptions: {
      openapi: {
        info: {
          title: '教務システムv2連携API API仕様書',
          version: '0.1.0',
        },
        components: {
        },
      },
    },
    swaggerUiOptions: {
      routePrefix: '/docs',
    },
  });
  const apiServer = ApiServer(server);
  try {
    await apiServer.listen({ port: PORT, host: HOST_ADDRESS });
    console.log(`Server listening at ${HOST_ADDRESS}:${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const ApiServer = (fastify: FastifyInstance) => {
  return fastify
    .register(require('@fastify/formbody'))
    .register(routes);
};

main();
