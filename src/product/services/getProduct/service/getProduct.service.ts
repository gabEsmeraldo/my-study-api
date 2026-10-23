import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetProductRepository } from "../repository/getProduct.repository.js";
import { GetProductInputDTO } from "../dto/getProductInput.dto.js";
import { GetProductDataDTO } from "../dto/getProductData.dto.js";

@Injectable()
export class GetProductService{
    constructor(private readonly getProductRepository: GetProductRepository){}
    
    async execute(dto: GetProductInputDTO): Promise<GetProductDataDTO[]>{
        try {
            return await this.getProductRepository.getProducts(dto);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}