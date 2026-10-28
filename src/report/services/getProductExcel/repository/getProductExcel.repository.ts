import { Injectable } from "@nestjs/common";
import { GetProductExcelInputDTO } from "../dto/getProductExcelInput.dto.js";
import { GetProductExcelDataDTO } from "../dto/getProductExcelData.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class GetProductExcelRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async getProducts(data: GetProductExcelInputDTO): Promise<GetProductExcelDataDTO[]> {
        const sql = `
            SELECT p.id AS product_id. p.name, p.price, p.stock
            FROM products p
            WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%')
            ORDER BY p.name
        `;

        return await this.db_postgres.query<GetProductExcelDataDTO>(sql, [
            data.search ?? null,
        ])
    }
}