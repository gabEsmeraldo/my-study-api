import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostUserRepository } from "../repository/postUser.repository.js";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { PostUserInputDTO } from "../dto/postUserInput.dto.js";
import { PostUserOutputDTO } from "../dto/postUserOutput.dto.js";
import { Profile } from "../../../../auth/enums/profiles.enum.js";

@Injectable()
export class PostUserService{
    constructor(
        private readonly postUserRepository: PostUserRepository,
        private readonly cryptoService: CryptoService,
    ){}

    async execute(dto: PostUserInputDTO): Promise<PostUserOutputDTO>{
        try{
            if(await this.postUserRepository.verifyUsername(dto.username)) {
                throw new BadRequestException('Usuário já cadastrado')
            }
            if(await this.postUserRepository.verifyEmail(dto.email)) {
                throw new BadRequestException('Email já cadastrado')
            }

            const hashed_password = await this.cryptoService.hashPassword(dto.password);
            const encrypted_document = this.cryptoService.encryptData(dto.document);

            const user_id = await this.postUserRepository.insertUser(
                dto.username,
                dto.email,
                hashed_password,
                encrypted_document,
                dto.role ?? Profile.DEFAULT_USER,
            ) 
            return { user_id } 
        }catch (error) {
            if(error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(error)
        }
    }
}