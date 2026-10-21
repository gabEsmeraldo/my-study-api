import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PutProductRepository } from "../repository/putProduct.repository.js";
import { PutProductInputDTO } from "../dto/putProductInput.dto.js";

@Injectable()
export class PutProductService{
    constructor(private readonly putProductRepository: PutProductRepository){}

    async execute(dto: PutProductInputDTO): Promise<void>{
        try {
            if (!await this.putProductRepository.productExists(dto.product_id)){
                throw new NotFoundException('Produto não foi encontrado.')
            }
            if(dto.name){
                if(await this.putProductRepository.verifyProductName(dto.name, dto.product_id)){
                    throw new BadRequestException('Produto já cadastrado.')
                }
            }
            return await this.putProductRepository.updateProduct(dto);
        } catch (error) {
            if(error instanceof NotFoundException) throw error
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}