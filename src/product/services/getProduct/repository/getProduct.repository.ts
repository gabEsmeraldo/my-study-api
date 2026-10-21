import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { GetProductDataDTO } from "../dto/getProductData.dto.js";

@Injectable()
export class GetProductRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async getProducts(dto: GetProductInputDTO): Promise<GetProductDataDTO[]>{
        const result = this.db_memory.products
        if(dto.search){
            return result.filter((product) => product.name.toLowerCase().includes(dto.search.toLowerCase()))
        }
        return result
    }
}