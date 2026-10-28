import { Injectable } from "@nestjs/common";
import { GetProductPdfInputDTO } from "../dto/getProductPdfInput.dto.js";
import { GetProductPdfDataDTO } from "../dto/getProductPdfData.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class GetProductPdfRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async getProducts(data: GetProductPdfInputDTO): Promise<GetProductPdfDataDTO[]> {
        const sql = `
            SELECT p.id AS product_id. p.name, p.price, p.stock
            FROM products p
            WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%')
            ORDER BY p.name
        `;

        return await this.db_postgres.query<GetProductPdfDataDTO>(sql, [
            data.search ?? null,
        ])
    }
}