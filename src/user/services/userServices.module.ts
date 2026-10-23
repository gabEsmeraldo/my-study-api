import { Module } from "@nestjs/common";
import { GetUserService } from "./getUser/service/getUser.service.js";
import { GetUserRepository } from "./getUser/repository/getUser.repository.js";
import { PostUserService } from "./postUser/service/postUser.service.js";
import { PostUserRepository } from "./postUser/repository/postUser.repository.js";
import { PutUserService } from "./putUser/service/putUser.service.js";
import { PutUserRepository } from "./putUser/repository/putUser.repository.js";
import { DeleteUserService } from "./deleteUser/service/deleteUser.service.js";
import { DeleteUserRepository } from "./deleteUser/repository/deleteUser.repository.js";
import { UserController } from "../controller/user.controller.js";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { CryptoService } from "../../shared/crypto/services/crypto.service.js";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers:[UserController],
    providers:[
        GetUserService,
        GetUserRepository,
        PostUserService,
        PostUserRepository,
        PutUserService,
        PutUserRepository,
        DeleteUserService,
        DeleteUserRepository,
        CryptoService,
    ],
})
export class UserServicesModule{}