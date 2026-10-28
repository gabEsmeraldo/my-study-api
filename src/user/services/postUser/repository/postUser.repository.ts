import { Injectable } from "@nestjs/common";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";
import oracledb from "oracledb";

@Injectable()
export class PostUserRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async verifyUsername(username: string): Promise<number | undefined>{
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE UPPER(u.USERNAME) = UPPER(:username)
        `;

        const binds = {
            username,
        }

        const result = await this.db_oracle.findOne<{ id: number }>(sql, binds)

        return result?.id;
    }

    async verifyEmail(email: string): Promise<number | undefined>{
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE UPPER(u.EMAIL) = UPPER(:email)
        `;

        const binds = {
            email,
        }

        const result = await this.db_oracle.findOne<{ id: number }>(sql, binds)

        return result?.id;
    }

    async insertUser(
        username: string,
        email: string,
        password: string,
        document: string,
        role: string,
        transaction: oracledb.Connection,
    ): Promise<number | undefined> {
        const sql = `
            INSERT INTO STUDY.USERS
            (USERNAME, EMAIL, PASSWORD, DOCUMENT, ROLE, STATUS)
            VALUES (:username, :email, :password, :document, :role, :status)
            RETURNING ID INTO :id
        `;

        const binds = {
            username,
            email,
            password,
            document,
            role,
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        }

        const result = await this.db_oracle.queryBindOut(sql, binds, transaction);

        const out_binds = result.outBinds as { id: number[] } | undefined;

        return out_binds?.id[0];
    }
}