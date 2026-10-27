import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { PostLoginDataDTO } from "../dto/postLoginData.dto.js";

@Injectable()
export class PostLoginRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async findUser(username: string): Promise<PostLoginDataDTO | undefined> {
        const user = this.db_memory.users.find(
            (user) => user.username.toUpperCase() === username.toUpperCase(),
        );

        if(!user) return undefined;

        return {
            user_id: user.user_id,
            username: user.username,
            password: user.password,
            role: user.role,
            status: user.status,
        };
    }
}