import { Injectable } from "@nestjs/common";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class DeleteProductRepository{
    constructor(private readonly db_postgres: PostgresDatabaseService){}

    async deleteProduct(product_id: number): Promise<number | undefined>{
        const sql = `
            DELETE FROM products WHERE id = $1 RETURNING id
        `;

        const result = await this.db_postgres.findOne<{ id: number }>(sql, [
            product_id,
        ]);

        return result?.id;
    }
}