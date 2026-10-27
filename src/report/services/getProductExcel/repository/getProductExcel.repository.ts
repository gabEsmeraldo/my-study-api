import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { GetProductExcelInputDTO } from "../dto/getProductExcelInput.dto.js";
import { GetProductExcelDataDTO } from "../dto/getProductExcelData.dto.js";

@Injectable()
export class GetProductExcelRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async getProducts(data: GetProductExcelInputDTO): Promise<GetProductExcelDataDTO[]> {
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