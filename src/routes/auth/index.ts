import type { FastifyInstance, FastifyRequest } from 'fastify';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { IUser, LoginBody } from '@/types';
import bcrypt from 'bcryptjs';

// In-memory storage of users
const Users: IUser[] = []

export function getUserResData(user) {
    return {
        username: user.username,
        tokens: user.tokens.length
    }
}
 
export async function generateToken(user: IUser) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not present in env.")
    }

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '72h' });
    return token;
};

export async function findByToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not present in env.")
    }

    let decoded;
    try {
        if (!token) {
            return new Error('Missing token header');
        }
        decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
        return error;
    }

    const {username} = decoded
    const user = Users.find(u => u.username === username)
    if (!user) {
        throw new Error('Username does not exist.');
    }
    return user
}

export async function findByCredentials(username, password) {
    const user = Users.find(u => u.username === username)
    if (!user) {
        throw new Error('Username does not exist.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password.');
    }
    return user;
}

export default function registerAuthRoutes(fastify: FastifyInstance) {
    // signup route
    fastify.route({
        method: ['POST', 'HEAD'],
        url: '/signup',
        logLevel: 'warn',
        handler: async (req: FastifyRequest<{ Body: LoginBody }>, reply) => {
            try {
                const { username, password } = req.body;

                // If user exists, signin instead of signup
                const existingUser = Users.find(u => u.username === username)
                if (existingUser) {
                    return await fastify.inject({
                        method: 'POST',
                        url: '/signin',
                        payload: req.body,
                    }).then((loginResponse) => {
                        reply
                            .status(loginResponse.statusCode)
                            .headers(loginResponse.headers)
                            .send(loginResponse.json());
                    });
                }

                const newUser = req.body as IUser
                newUser.password = await bcrypt.hash(password, 8);

                const token = await generateToken(newUser);
                newUser.tokens = [{ token }]
                Users.push(newUser)
                reply
                    .setCookie('token', token, {
                        httpOnly: true,
                        path: '/',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : "lax",
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24, // 1 week
                    })
                    .status(201)
                    .send({ msg: "You are signed up", user: getUserResData(newUser) });
            } catch (error) {
                reply.status(400).send(error);
            }
        }
    });


    // signin route
    fastify.route({
        method: ['POST', 'HEAD'],
        url: '/signin',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyUsernameAndPassword]),
        handler: async (req, reply) => {

            // Generate new token and add to list of tokens
            const token = await generateToken(req.user);
            const user = Users.find(u => u.username === req.user.username) as IUser;
            if (user) {
                user.tokens.push({ token });
            }

            reply
                .setCookie('token', token, {
                    httpOnly: true,
                    path: '/',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : "lax",
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24,
                })
                .send({ status: 'You are signed in', user: getUserResData(req.user) });
        }
    });


    // signout route
    fastify.route({
        method: ['POST', 'HEAD'],
        url: '/signout',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: async (req, reply) => {
            try {

                // Remove token
                const newTokens = req.user.tokens.filter((token) => {
                    return token.token !== req.token;
                });
                const userIndex = Users.findIndex(u => u.username === req.user.username);
                if (Users[userIndex]) {
                    Users[userIndex].tokens = newTokens
                }

                reply
                    .clearCookie('token', { path: '/' })
                    .send({ status: 'You are signed out!', user: req.user.username });
            } catch (e) {
                reply.status(500).send();
            }
        }
    });
}
