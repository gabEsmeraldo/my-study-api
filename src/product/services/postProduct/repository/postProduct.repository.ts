import { Injectable } from "@nestjs/common";
import { MemoryDatabaseService } from "../../../../shared/database/services/memoryDatabase.service.js";
import { PostProductInputDTO } from "../dto/postProductInput.dto.js";
import { PostProductOutputDTO } from "../dto/postProductOutput.dto.js";

@Injectable()
export class PostProductRepository{
    constructor(private readonly db_memory: MemoryDatabaseService){}
    async verifyProductName(name: string): Promise<number | undefined>{
        return this.db_memory.products.find((product) => product.name.toLowerCase() == name.toLowerCase())?.product_id;
    }

    async insertProduct(dto: PostProductInputDTO): Promise<PostProductOutputDTO>{
        const id = this.db_memory.nextProductId()
        this.db_memory.products.push({
            "product_id": id,
            "name": dto.name,
            "description": dto.description,
            "price": dto.price,
            "stock": dto.stock,
            "created_at": new Date(),
        })
        return { product_id: id } as PostProductOutputDTO;
    }
}
