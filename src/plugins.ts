import type { FastifyInstance } from 'fastify';
import FastifyCORS from '@fastify/cors';
import FastifyCookie from '@fastify/cookie';
import FastifyAuth from '@fastify/auth';
import FastifyFormbody from '@fastify/formbody';
import FastifyMultipart from '@fastify/multipart';

export default function registerPlugins(fastify: FastifyInstance) {
  fastify.register(FastifyCORS, {
    origin: (origin, cb) => {
    const isDev = process.env.NODE_ENV !== 'production';

    // Allow all in development
    if (isDev || !origin) {
      return cb(null, true);
    }

    try {
      const allowedRoot = 'yourdomain.com'; // ← Set this once, hardcoded or computed
      const hostname = new URL(origin).hostname;

      // Allow any subdomain of yourdomain.com, or yourdomain.com itself
      if (hostname === allowedRoot || hostname.endsWith(`.${allowedRoot}`)) {
        return cb(null, true);
      }

      return cb(new Error(`CORS: Origin ${origin} not allowed`), false);
    } catch (err) {
      return cb(new Error('CORS: Invalid origin'), false);
    }
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