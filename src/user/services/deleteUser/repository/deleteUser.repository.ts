import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";

@Injectable()
export class DeleteUserRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async userExists(user_id: number): Promise<number | undefined> {
        const user = this.db_memory.users.find((user) => user.user_id === user_id)
        return user?.user_id;
    }

    async deleteUser(user_id: number): Promise<void> {
        const index = this.db_memory.users.findIndex((user) => user.user_id === user_id)

        if (index !== -1){
            this.db_memory.users.splice(index, 1);
        }
    }
}