import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeleteUserRepository } from "../repository/deleteUser.repository.js";
import { DeleteUserInputDTO } from "../dto/deleteUserInput.dto.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";

const PROTECTED_USERS = [1];

@Injectable()
export class DeleteUserService{
    constructor(
        private readonly deleteUserRepository: DeleteUserRepository,
        private readonly database: OracleDatabaseService,
    ){}

    async execute(dto: DeleteUserInputDTO): Promise<void> {
        const transaction = await this.database.open()
        try {
            if(PROTECTED_USERS.includes(dto.user_id)){
                throw new ForbiddenException('Usuário bloqueado para modificações')
            }

            if(!await this.deleteUserRepository.userExists(dto.user_id)){
                throw new NotFoundException('Usuário não encontrado')
            }
            await this.deleteUserRepository.deleteUser(dto.user_id, transaction);
            await this.database.commitAndClose(transaction);
        } catch (error) {
            await this.database.rollbackAndClose(transaction);
            if(error instanceof ForbiddenException) throw error
            if(error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(error)    
        }
    }
}