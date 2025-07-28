import type { FastifyInstance } from 'fastify';
import type { LoginBody } from '@/types';
import { findByCredentials, findByToken } from './auth';

export function decorateHandlers(fastify: FastifyInstance) {

  fastify.decorate('asyncVerifyJWT', async (request, reply) => {
    try {
        if (!request.cookies.token) {
            throw new Error('No token was sent');
        }
        const token = request.cookies.token;
        const user = await findByToken(token);
        if (!user) {
            // handles logged out user with valid token
            throw new Error('Authentication failed!');
        }
        request.user = user;
        request.token = token;
    } catch (error) {
        reply.code(401).send(error);
    }
  });

  fastify.decorate('asyncVerifyUsernameAndPassword', async (request, reply) => {
    try {
        const { username, password } = request.body as LoginBody;
        const user = await findByCredentials(username, password);
        request.user = user;
    } catch (error) {
        reply.code(400).send({ error: (error as Error).message });
    }
  });

}