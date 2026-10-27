import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PostLoginRepository } from "../repository/postLogin.repository.js";
import { JwtService } from "@nestjs/jwt";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { PostLoginInputDTO } from "../dto/postLoginInput.dto.js";
import { PostLoginOutputDTO } from "../dto/postLoginOutput.dto.js";

@Injectable()
export class PostLoginService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly cryptoService: CryptoService,
        private readonly postLoginRepository: PostLoginRepository
    ){}

    async execute(dto: PostLoginInputDTO): Promise<PostLoginOutputDTO> {
        const user_data = await this.postLoginRepository.findUser(dto.username)

        const valid_password = user_data ? await this.cryptoService.comparePassword(
            dto.password,
            user_data.password,
        ): false;

        if (!user_data || user_data.status !== 'A' || !valid_password) {
            throw new UnauthorizedException('Usuário ou Senha Inválidos');
        }

        const payload = {
            user_id: user_data.user_id,
            username: user_data.username,
            roles: [user_data.role],
        };

        const access_token = await this.jwtService.signAsync(payload);
        return { access_token, ...payload };
    }

}