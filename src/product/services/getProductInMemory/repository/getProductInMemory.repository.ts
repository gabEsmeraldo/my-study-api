import { Injectable } from "@nestjs/common";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";
import { GetProductDataDTO } from "../../getProduct/dto/getProductData.dto.js";

@Injectable()
export class GetProductInMemoryRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async getAllProducts(): Promise<GetProductDataDTO[]>{
        const sql = `SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.created_at
        FROM products p
        ORDER BY p.id`;

        return await this.db_postgres.query<GetProductDataDTO>(sql);
    }
}