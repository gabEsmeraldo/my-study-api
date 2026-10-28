import { Injectable } from "@nestjs/common";
import { PostLoginDataDTO } from "../dto/postLoginData.dto.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";

@Injectable()
export class PostLoginRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async findUser(username: string): Promise<PostLoginDataDTO | undefined> {
        const sql = `
            SELECT u.ID AS USER_ID, u.USERNAME, u.PASSWORD, u.ROLE, u.STATUS
            FROM STUDY.USERS u
            WHERE UPPER(u.USERNAME) = UPPER(:username)
        `;

        return await this.db_oracle.findOne<PostLoginDataDTO>(sql, { username });
    }
}