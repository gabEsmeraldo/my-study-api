import { Injectable } from "@nestjs/common";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";
import oracledb from "oracledb";

@Injectable()
export class DeleteUserRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async userExists(user_id: number): Promise<number | undefined> {
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE u.ID = :user_id
        `;

        const result = await this.db_oracle.findOne<{ id: number }>(sql, [
            user_id
        ])

        return result?.id;
    }

    async deleteUser(user_id: number, transaction: oracledb.Connection): Promise<void> {
        const sql = `
            DELETE FROM STUDY.USERS WHERE ID = :user_id
        `;

        await this.db_oracle.query(sql, { user_id }, transaction)
    }
}