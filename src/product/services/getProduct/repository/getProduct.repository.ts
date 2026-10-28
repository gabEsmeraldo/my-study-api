import { Injectable } from "@nestjs/common";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { GetProductDataDTO } from "../dto/getProductData.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";
import { getOffset } from "../../../../shared/pagination/pagination.util.js";

@Injectable()
export class GetProductRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async getProductCount(dto: GetProductInputDTO): Promise<number> {
        const sql = `
            SELECT count(1) AS total 
            FROM products p
            WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%')
        `;

        const result = await this.db_postgres.findOne<{ total: number }>(sql, [
            dto.search ?? null,
        ]);

        return result?.total ?? 0;
    }

    async getProductData(dto: GetProductInputDTO): Promise<GetProductDataDTO[]>{
        const direction = dto.alphabetic === 'DESC' ? 'DESC' : 'ASC'

        const sql = `SELECT 
            p.id AS product_id,
            p.name,
            p.description,
            p.price,
            p.stock,
            p.created_at
        FROM products p
        WHERE ($1::text IS NULL OR p.name ILIKE '%' || $1 || '%')
        ORDER BY p.name ${direction}, p.id
        LIMIT $2 OFFSET $3
        `;

        const binds = [dto.search ?? null, dto.size, getOffset(dto)]
        return await this.db_postgres.query<GetProductDataDTO>(sql ,binds);
    }

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