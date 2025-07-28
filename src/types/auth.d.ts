declare module 'fastify' {
    interface FastifyRequest {
        user?: any;     // Replace `any` with your actual User type
        token?: string;
    }

    interface FastifyInstance {
        asyncVerifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        asyncVerifyUsernameAndPassword: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

export interface LoginBody {
    username: string;
    password: string;
}

export type ProfileBody = {
    profilePhoto?: MultipartFile;
}

