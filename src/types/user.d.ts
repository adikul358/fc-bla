// Type user schema
export interface IUser {
    username: string;
    password: string;
    tokens: {
        token: string;
    }[];
}