import { Injectable } from "@nestjs/common";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";
import oracledb from "oracledb";

const UPDATABLE_COLUMNS = [
    'username',
    'email',
    'password',
    'document',
    'role',
    'status',
];

@Injectable()
export class PutUserRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async userExists(user_id: number): Promise<number | undefined> {
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE u.ID = :user_id
        `;

        const binds = {
            user_id,
        }

        const result = await this.db_oracle.findOne<{ id: number }>(sql, binds)

        return result?.id;
    }

    async verifyUsername(
        username: string,
        user_id: number,
    ): Promise<number | undefined> {
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE UPPER(u.USERNAME) = UPPER(:username) AND u.ID <> :user_id
        `

        const binds = {
            username,
            user_id
        }

        const result = await this.db_oracle.findOne<{ id: number }>(sql, binds)

        return result?.id;
    };

    async verifyEmail(
        email: string,
        user_id: number,
    ): Promise<number | undefined> {
        const sql = `
            SELECT u.ID FROM STUDY.USERS u
            WHERE UPPER(u.EMAIL) = UPPER(:email) AND u.ID <> :user_id
        `

        const binds = {
            email,
            user_id
        }

        const result = await this.db_oracle.findOne<{ id: number }>(sql, binds)

        return result?.id;
    };

    async updateUser(
        user_id: number,
        fields: Record<string, string | undefined>,
        transaction: oracledb.Connection,
    ): Promise<void> {
        const columns = Object.entries(fields).filter(
            ([column, value]) => 
                value !== undefined && UPDATABLE_COLUMNS.includes(column)
        );

        if(!columns.length) return;

        const set_clause = columns
            .map(([column]) => `${column.toUpperCase()} = :${column}`)
            .join(', ');
            
        const sql = `UPDATE STUDY.USERS SET ${set_clause} WHERE ID = :user_id`;

        const binds = { ...Object.fromEntries(columns), user_id };
        await this.db_oracle.query(sql, binds, transaction)
    }
}