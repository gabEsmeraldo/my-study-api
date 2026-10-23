import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GetUserRepository } from "../repository/getUser.repository.js";
import { GetUserInputDTO } from "../dto/getUserInput.dto.js";
import { GetUserDataDTO } from "../dto/getUserData.dto.js";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";

@Injectable()
export class GetUserService {
    constructor(
        private readonly getUserRepository: GetUserRepository,
        private readonly cryptoService: CryptoService,
    ){}

    async execute(_dto: GetUserInputDTO): Promise<GetUserDataDTO[]>{
        try {
            const users = await this.getUserRepository.getUsers();

            return users.map((user) => ({
                ...user,
                document: user.document ? this.cryptoService.decryptData(user.document) : null,
            }));
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}