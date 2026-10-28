import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProductRepository } from "../repository/postProduct.repository.js";
import { PostProductInputDTO } from "../dto/postProductInput.dto.js";
import { PostProductOutputDTO } from "../dto/postProductOutput.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class PostProductService{
    constructor(
        private readonly postProductRepository: PostProductRepository,
        private readonly database: PostgresDatabaseService,
    ){}

    async execute(dto: PostProductInputDTO): Promise<PostProductOutputDTO>{
        if(await this.postProductRepository.verifyProductName(dto.name)){throw new BadRequestException('Produto já cadastrado.')}
        const transaction = await this.database.open();

        try {
            const product_id = await this.postProductRepository.insertProduct(
                dto, transaction,
            );

            if(!product_id) {
                throw new Error('Falha ao criar produto')
            }
            await this.database.commitAndClose(transaction)

            return { product_id };
        } catch (error) {
            await this.database.rollbackAndClose(transaction)
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}