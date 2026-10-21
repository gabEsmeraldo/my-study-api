import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";

@Injectable()
export class DeleteProductRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}

    async deleteProduct(product_id: number): Promise<number | undefined>{
        const index = this.db_memory.products.findIndex((product) => product.product_id === product_id)
        if(index === -1) return undefined;
        
        this.db_memory.products.splice(index, 1)
        return product_id;
    }
}