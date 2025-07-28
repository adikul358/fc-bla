import type { FastifyInstance } from 'fastify';
import FastifyCORS from '@fastify/cors';
import FastifyCookie from '@fastify/cookie';
import FastifyAuth from '@fastify/auth';
import FastifyFormbody from '@fastify/formbody';
import FastifyMultipart from '@fastify/multipart';

export default function registerPlugins(fastify: FastifyInstance) {
  fastify.register(FastifyCORS, {
    origin: (origin, cb) => {
      if (process.env.NODE_ENV !== 'production') return cb(null, true);

      const hostname = origin ? new URL(origin).hostname : '';
      if (hostname === 'localhost' || hostname === process.env.HOST_URL) return cb(null, true);

      cb(new Error('CORS: Origin Not allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  fastify.register(FastifyCookie);
  fastify.register(FastifyAuth);
  fastify.register(FastifyFormbody);
  fastify.register(FastifyMultipart, {
    attachFieldsToBody: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  });

}