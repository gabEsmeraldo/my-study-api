import { Injectable } from "@nestjs/common";
import pg from 'pg';
import { PostProductInputDTO } from "../dto/postProductInput.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class PostProductRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}
    async verifyProductName(name: string): Promise<number | undefined>{
        const sql = `SELECT p.id FROM products p WHERE UPPER(p.name) = UPPER($1)`;

        const result = await this.db_postgres.findOne<{ id: number }>(sql, [name])

        return result?.id;
    }

    async insertProduct(dto: PostProductInputDTO, transaction: pg.PoolClient): Promise<number | undefined>{
        const sql = `
        INSERT INTO products (name, description, price, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `;

        const result = await this.db_postgres.findOne<{ id: number }>(
            sql,
            [dto.name, dto.description ?? null, dto.price, dto.stock],
            transaction,
        )

        return result?.id;
    }
}
