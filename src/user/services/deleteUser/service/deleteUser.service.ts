import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeleteUserRepository } from "../repository/deleteUser.repository.js";
import { DeleteUserInputDTO } from "../dto/deleteUserInput.dto.js";

const PROTECTED_USERS = [1];

@Injectable()
export class DeleteUserService{
    constructor(private readonly deleteUserRepository: DeleteUserRepository){}

    async execute(dto: DeleteUserInputDTO): Promise<void> {
        try {
            if(PROTECTED_USERS.includes(dto.user_id)){
                throw new ForbiddenException('Usuário bloqueado para modificações')
            }

            if(!await this.deleteUserRepository.userExists(dto.user_id)){
                throw new NotFoundException('Usuário não encontrado')
            }
            await this.deleteUserRepository.deleteUser(dto.user_id)
        } catch (error) {
            if(error instanceof ForbiddenException) throw error
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(error)    
        }
    }
}