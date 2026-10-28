import { Injectable } from "@nestjs/common";
import { GetProductInMemoryRepository } from "../repository/getProductInMemory.repository.js";
import { GetProductInMemoryInputDTO } from "../dto/getProductInMemoryInput.dto.js";
import { GetProductInMemoryOutputDTO } from "../dto/getProductInMemoryOutput.dto.js";
import { paginateInMemory } from "../../../../shared/pagination/pagination.util.js";

@Injectable()
export class GetProductInMemoryService{
    constructor(private readonly getProductInMemoryRepository: GetProductInMemoryRepository){}

    async execute(dto: GetProductInMemoryInputDTO): Promise<GetProductInMemoryOutputDTO> {
        const products = await this.getProductInMemoryRepository.getAllProducts();

        const search = dto.search?.toUpperCase()

        const filtered_products = search ? products.filter((product) => 
        product.name.toUpperCase().includes(search)) : 
        products

        const direction = dto.alphabetic === 'DESC' ? -1 : 1;

        const sorted_products = [...filtered_products].sort(
            (a, b) =>
                a.name.localeCompare(b.name) * direction || a.product_id - b.product_id,
        );

        return paginateInMemory(sorted_products, dto);
    }
}