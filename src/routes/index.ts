import type { FastifyInstance } from 'fastify';
import { decorateHandlers } from './middleware';
import registerAuthRoutes from './auth';
import registerAPIRoutes from './api';

export default function registerRoutes(fastify: FastifyInstance) {
    decorateHandlers(fastify);

    fastify.after(() => {
        registerAuthRoutes(fastify)
        registerAPIRoutes(fastify)
    })

}
