import { Injectable } from "@nestjs/common";
import { GetUserDataDTO } from "../dto/getUserData.dto.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";

@Injectable()
export class GetUserRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async getUsers(): Promise<GetUserDataDTO[]> {
        const sql = `
            SELECT
            u.iD AS USER_ID,
            u.USERNAME,
            u.EMAIL,
            u.DOCUMENT,
            u.ROLE,
            u.STATUS,
            u.CREATED_AT
            FROM STUDY.USERS u
            ORDER BY u.ID
        `

        return await this.db_oracle.query<GetUserDataDTO>(sql);
    }
}