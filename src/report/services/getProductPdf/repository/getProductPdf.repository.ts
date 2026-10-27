import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { GetProductPdfInputDTO } from "../dto/getProductPdfInput.dto.js";
import { GetProductPdfDataDTO } from "../dto/getProductPdfData.dto.js";

@Injectable()
export class GetProductPdfRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async getProducts(data: GetProductPdfInputDTO): Promise<GetProductPdfDataDTO[]> {
        const search = data.search?.toUpperCase();

        return this.db_memory.products
            .filter(
                (product) => !search || product.name.toUpperCase().includes(search),
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(({ product_id, name, price, stock }) => ({
                product_id,
                name,
                price,
                stock,
            }));
    }
}