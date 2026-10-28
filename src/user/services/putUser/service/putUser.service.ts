import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PutUserRepository } from "../repository/putUser.repository.js";
import { PutUserInputDTO } from "../dto/putUserInput.dto.js";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";

@Injectable()
export class PutUserService{
    constructor(
        private readonly putUserRepository: PutUserRepository,
        private readonly database: OracleDatabaseService,
        private readonly cryptoService: CryptoService,
    ){}

    async execute(dto: PutUserInputDTO): Promise<void> {
        const transaction = await this.database.open();
        try {
            if(!await this.putUserRepository.userExists(dto.user_id)){
                throw new BadRequestException('Usuário não encontrado!')
            }

            if(dto.username) {
                if(await this.putUserRepository.verifyUsername(dto.username, dto.user_id)){
                    throw new BadRequestException('Nome de usuário já existente')
                }
            }

            if(dto.email) {
                if(await this.putUserRepository.verifyEmail(dto.email, dto.user_id)){
                    throw new BadRequestException('Email já utilizado')
                }
            }

            await this.putUserRepository.updateUser(dto.user_id, {
                username: dto.username,
                email: dto.email,
                password: dto.password ? await this.cryptoService.hashPassword(dto.password) : undefined,
                document: dto.document ? this.cryptoService.encryptData(dto.document) : undefined,
                role: dto.role,
                status: dto.status,
            }, transaction);
            await this.database.commitAndClose(transaction);
        } catch (error) {
            await this.database.rollbackAndClose(transaction);
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}