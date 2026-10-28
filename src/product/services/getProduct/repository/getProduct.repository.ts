import { Injectable } from "@nestjs/common";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { GetProductDataDTO } from "../dto/getProductData.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class GetProductRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async getProducts(dto: GetProductInputDTO): Promise<GetProductDataDTO[]>{
        const sql = `SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at
        FROM products p
        WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%')
        ORDER BY p.id`;

        return await this.db_postgres.query<GetProductDataDTO>(sql, [
            dto.search ?? null,
        ]);
    }
}