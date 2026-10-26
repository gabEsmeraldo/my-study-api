import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetProductRepository } from "../repository/getProduct.repository.js";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { paginateInMemory } from "../../../../shared/pagination/pagination.util.js";
import { GetProductOutputDTO } from "../dto/getProductOutput.dto.js";

@Injectable()
export class GetProductService{
    constructor(private readonly getProductRepository: GetProductRepository){}
    
    async execute(dto: GetProductInputDTO): Promise<GetProductOutputDTO>{
        try {
            return paginateInMemory(await this.getProductRepository.getProducts(dto), dto);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}