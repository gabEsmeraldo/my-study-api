import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeleteProductRepository } from "../repository/deleteProduct.repository.js";
import { DeleteProductInputDTO } from "../dto/deleteProductInput.dto.js";
import { DeleteProductOutputDTO } from "../dto/deleteProductOutput.dto.js";

const protected_product_id = 1

@Injectable()
export class DeleteProductService{
    constructor(private readonly deleteProductRepository: DeleteProductRepository){}
    
    async execute(dto: DeleteProductInputDTO): Promise<DeleteProductOutputDTO>{
        try {
            if(dto.product_id === protected_product_id){
                throw new ForbiddenException('Produto bloqueado para modificações')
            }
            const removed_id = await this.deleteProductRepository.deleteProduct(dto.product_id)
            if(removed_id === undefined){ throw new NotFoundException('Produto não encontrado.')}
            return {"product_id": removed_id} as DeleteProductOutputDTO
        } catch (error) {
            if(error instanceof ForbiddenException) throw error
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(error)    
        }
    }
}