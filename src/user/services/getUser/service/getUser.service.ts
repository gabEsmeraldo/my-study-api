import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUserRepository } from "../repository/getUser.repository.js";
import { GetUserInputDTO } from "../dto/getUserInput.dto.js";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { GetUserOutputDTO } from "../dto/getUserOutput.dto.js";
import { paginateInMemory } from "../../../../shared/pagination/pagination.util.js";

@Injectable()
export class GetUserService {
    constructor(
        private readonly getUserRepository: GetUserRepository,
        private readonly cryptoService: CryptoService,
    ){}

    async execute(dto: GetUserInputDTO): Promise<GetUserOutputDTO>{
        try {
            const users = await this.getUserRepository.getUsers();

            const decrypted_users = users.map((user) => ({
                ...user,
                document: user.document ? this.cryptoService.decryptData(user.document) : null,
            }));
            return paginateInMemory(decrypted_users, dto)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}