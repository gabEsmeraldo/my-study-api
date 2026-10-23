import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";

@Injectable()
export class PutUserRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async userExists(user_id: number): Promise<number | undefined> {
        const user = this.db_memory.users.find((user) => user.user_id === user_id)
        return user?.user_id;
    }

    async verifyUsername(
        username: string,
        user_id: number,
    ): Promise<number | undefined> {
        const user = this.db_memory.users.find((user) => 
            user.username.toLowerCase() === username.toLowerCase() && 
            user.user_id !== user_id)
        return user?.user_id; 
    };

    async verifyEmail(
        email: string,
        user_id: number,
    ): Promise<number | undefined> {
        const user = this.db_memory.users.find((user) => 
            user.email.toLowerCase() === email.toLowerCase() && 
            user.user_id !== user_id)
        return user?.user_id; 
    };

    async updateUser(
        user_id: number,
        fields: Record<string, string | undefined>,
    ): Promise<void> {
        const user = this.db_memory.users.find((user) => user.user_id === user_id);
        if(!user) return;

        for(const [key, value] of Object.entries(fields)) {
            if (value !== undefined){
                Object.assign(user, {[key]: value});
            }
        }
    }
}