import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUserRepository } from "../repository/getUser.repository.js";
import { GetUserInputDTO } from "../dto/getUserInput.dto.js";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { GetUserOutputDTO } from "../dto/getUserOutput.dto.js";
import { buildPaginationOutput, paginateInMemory } from "../../../../shared/pagination/pagination.util.js";

@Injectable()
export class GetUserService {
    constructor(
        private readonly getUserRepository: GetUserRepository,
        private readonly cryptoService: CryptoService,
    ){}

    async execute(dto: GetUserInputDTO): Promise<GetUserOutputDTO>{
        try {
            const total = await this.getUserRepository.getUserCount(dto);

            if(total === 0){
                return buildPaginationOutput([], total, dto)
            }

            const users = await this.getUserRepository.getUserData(dto)

            const decrypted_users = users.map((user) => ({
                ...user,
                document: user.document ? this.cryptoService.decryptData(user.document) : null,
            }));
            return buildPaginationOutput(decrypted_users, total, dto)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}