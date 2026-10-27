import { Module } from "@nestjs/common";
import { AuthController } from "../controller/auth.controller.js";
import { PostLoginService } from "./postLogin/service/postLogin.service.js";
import { PostLoginRepository } from "./postLogin/repository/postLogin.repository.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { CryptoModule } from "../../shared/crypto/crypto.module.js";

@Module({
    imports: [
      JwtModule.registerAsync({
        global: true,
        inject: [ConfigService],
        useFactory: (config_service: ConfigService) => ({
            secret: config_service.get<string>('JWT_SECRET'),
            signOptions: {
                expiresIn: config_service.get('JWT_EXPIRES_IN') ?? '1d',
            },
        }),
      }),
      DatabaseModule,
      CryptoModule,
    ],
    controllers:[AuthController],
    providers:[
        PostLoginService,
        PostLoginRepository,
    ],
})
export class AuthServicesModule{}