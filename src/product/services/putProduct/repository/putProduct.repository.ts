import { Injectable } from "@nestjs/common";
import pg from 'pg';
import { PutProductInputDTO } from "../dto/putProductInput.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class PutProductRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async productExists(product_id: number): Promise<number | undefined>{
        const sql = `SELECT p.id FROM products p WHERE p.id = $1`;

        const result = await this.db_postgres.findOne<{ id: number }>(sql,[
            product_id,
        ])

        return result?.id;
    }

    async verifyProductName(name: string, product_id: number): Promise<number | undefined>{
        const sql = `
            SELECT p.id FROM products p
            WHERE UPPER(p.name) = UPPER($1) AND p.id <> $2
        `;

        const result = await this.db_postgres.findOne<{ id: number }>(sql,[
            name,
            product_id,
        ])

        return result?.id;
    }

    async updateProduct(dto: PutProductInputDTO, transaction: pg.PoolClient): Promise<void>{
        const sql = `
            UPDATE products SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            stock = COALESCE($4, stock)
        WHERE id = $5
        `;

        const binds = [
            dto.name ?? null,
            dto.description ?? null,
            dto.price ?? null,
            dto.stock ?? null,
            dto.product_id,
        ];

        await this.db_postgres.query(sql, binds, transaction);
    }
}