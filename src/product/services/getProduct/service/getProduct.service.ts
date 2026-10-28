import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetProductRepository } from "../repository/getProduct.repository.js";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { buildPaginationOutput, paginateInMemory } from "../../../../shared/pagination/pagination.util.js";
import { GetProductOutputDTO } from "../dto/getProductOutput.dto.js";

@Injectable()
export class GetProductService{
    constructor(private readonly getProductRepository: GetProductRepository){}
    
    async execute(dto: GetProductInputDTO): Promise<GetProductOutputDTO>{
        try {
            const total = await this.getProductRepository.getProductCount(dto);

            if(total === 0) {
                return buildPaginationOutput([], total, dto)
            }

            return buildPaginationOutput(
                await this.getProductRepository.getProductData(dto),
                total,
                dto
            )
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}