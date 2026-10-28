import { Injectable } from "@nestjs/common";
import { GetUserDataDTO } from "../dto/getUserData.dto.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";
import { GetUserInputDTO } from "../dto/getUserInput.dto.js";
import { getOffset } from "../../../../shared/pagination/pagination.util.js";

const USER_FILTERS = `
    WHERE (:search IS NULL
            OR UPPER(u.username) LIKE '%' || UPPER(:search) || '%'
            OR UPPER(u.EMAIL) LIKE '%' || UPPER(:search) || '%')
        AND (:user_id IS NULL OR u.ID = :user_id)
`;

@Injectable()
export class GetUserRepository{
    constructor(private readonly db_oracle: OracleDatabaseService){}

    async getUserCount(dto: GetUserInputDTO): Promise<number> {
        const sql = `SELECT COUNT(1) AS TOTAL FROM STUDY.USERS u ${USER_FILTERS}`;

        const binds = {
            search: dto.search ?? null,
            user_id: dto.user_id ?? null,
        }

        const result = await this.db_oracle.findOne<{ total: number }>(sql, binds);

        return result?.total ?? 0;
    }

    async getUserData(dto: GetUserInputDTO): Promise<GetUserDataDTO[]> {
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
            ${USER_FILTERS}
            ORDER BY u.ID
            OFFSET :row_offset ROWS FETCH NEXT :page_size ROWS ONLY
        `;

        const binds = {
            search: dto.search ?? null,
            user_id: dto.user_id ?? null,
            row_offset: getOffset(dto),
            page_size: dto.size,
        }

        return await this.db_oracle.query<GetUserDataDTO>(sql, binds);
    }
}