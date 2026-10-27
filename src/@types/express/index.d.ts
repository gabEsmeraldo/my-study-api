declare global {
    namespace Express {
        interface User {
            user_id: number;
            username: string;
            roles: string[];
        }

        interface Request {
            user?: User;
        }
    }
}

export {};