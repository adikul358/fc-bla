import type { FastifyInstance } from 'fastify';
import fs from 'fs/promises';

export default function registerAPIRoutes(fastify: FastifyInstance) {
    fastify.route({
        method: ['GET', 'HEAD'],
        url: '/api',
        logLevel: 'warn',
        handler: async (req, reply) => {
            try {
                const raw = await fs.readFile('./src/data.json', 'utf-8');
                const data = JSON.parse(raw);
                reply.send({ data });
            } catch (err) {
                reply.code(500).send({ error: 'Failed to load data.json' });
                console.log(err)
            }
        }
    });

    fastify.route({
        method: ['GET', 'HEAD'],
        url: '/api/me',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: async (req, reply) => {
            try {
                const raw = await fs.readFile('./src/data.json', 'utf-8');
                const data = JSON.parse(raw);
                const ratedData = data.map(item => ({
                    ...item,
                    rating: Math.floor(Math.random() * 10) + 1
                }));
                reply.send({ ratedData });
            } catch (err) {
                reply.code(500).send({ error: 'Failed to load data.json' });
            }
        }
    });

}