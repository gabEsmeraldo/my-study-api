import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { PutProductInputDTO } from "../dto/putProductInput.dto.js";

@Injectable()
export class PutProductRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async productExists(product_id: number): Promise<Boolean>{
        return this.db_memory.products.some((product) => product.product_id === product_id)
    }

    async verifyProductName(name: string, product_id: number): Promise<Boolean>{
        return this.db_memory.products.some((product) => (product.name === name) && product.product_id != product_id)
    }

    async updateProduct(dto: PutProductInputDTO): Promise<void>{
        const index = this.db_memory.products.findIndex((product) => product.product_id === dto.product_id)
        let product = this.db_memory.products[index]
        product = {
            "product_id": product.product_id,
            "name": dto.name ? dto.name : product.name,
            "description": dto.description ? dto.description : product.description,
            "price": dto.price ? dto.price : product.price,
            "stock": dto.stock ? dto.stock : product.stock,
            "created_at": product.created_at
        }
        this.db_memory.products[index] = product
    }
}