import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { GetUserDataDTO } from "../dto/getUserData.dto.js";

@Injectable()
export class GetUserRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async getUsers(): Promise<GetUserDataDTO[]> {
        return this.db_memory.users.map(({ password: _password, ...user }) => user)
    }
}