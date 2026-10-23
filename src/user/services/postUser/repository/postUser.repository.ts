import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";

@Injectable()
export class PostUserRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async verifyUsername(username: string): Promise<number | undefined>{
        const user = this.db_memory.users.find(
            (user) => user.username.toLowerCase() === username.toLowerCase()
        )
        return user?.user_id
    }

    async verifyEmail(email: string): Promise<number | undefined>{
        const user = this.db_memory.users.find(
            (user) => user.email.toLowerCase() === email.toLowerCase()
        )
        return user?.user_id
    }

    async insertUser(
        username: string,
        email: string,
        password: string,
        document: string,
        role: string,
    ): Promise<number> {
        const user_id = this.db_memory.nextUserId();

        this.db_memory.users.push({
            user_id,
            username,
            email,
            password,
            document,
            role,
            status: 'A',
            created_at: new Date(),
        });

        return user_id;
    }
}