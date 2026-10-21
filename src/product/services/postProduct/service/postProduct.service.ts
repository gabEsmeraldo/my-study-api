import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProductRepository } from "../repository/postProduct.repository.js";
import { PostProductInputDTO } from "../dto/postProductInput.dto.js";
import { PostProductOutputDTO } from "../dto/postProductOutput.dto.js";

@Injectable()
export class PostProductService{
    constructor(private readonly postProductRepository: PostProductRepository){}

    async execute(dto: PostProductInputDTO): Promise<PostProductOutputDTO>{
        try {
            if(await this.postProductRepository.verifyProductName(dto.name) != undefined){throw new BadRequestException('Produto já cadastrado.')}
            return await this.postProductRepository.insertProduct(dto)
        } catch (error) {
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}