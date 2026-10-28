import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PutProductRepository } from "../repository/putProduct.repository.js";
import { PutProductInputDTO } from "../dto/putProductInput.dto.js";
import { PostgresDatabaseService } from "../../../../shared/database/services/postgresDatabase.service.js";

@Injectable()
export class PutProductService{
    constructor(
        private readonly putProductRepository: PutProductRepository,
        private readonly database: PostgresDatabaseService,
    ){}

    async execute(dto: PutProductInputDTO): Promise<void>{
        if(!await this.putProductRepository.productExists(dto.product_id)){
            throw new NotFoundException('Produto não encontrado.')
        }

        if(dto.name) {
            if(await this.putProductRepository.verifyProductName(dto.name, dto.product_id)){
                throw new BadRequestException('Produto já cadastrado.')
            }
        }

        const transaction = await this.database.open();

        try {
            await this.putProductRepository.updateProduct(dto, transaction);

            await this.database.commitAndClose(transaction);
        } catch (error) {
            await this.database.rollbackAndClose(transaction);
            if(error instanceof NotFoundException) throw error
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}