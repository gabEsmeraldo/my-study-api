import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module.js";
import { CryptoModule } from "./crypto/crypto.module.js";

@Module({
    imports: [
        DatabaseModule,
        CryptoModule,
    ],
    exports: [
        DatabaseModule,
        CryptoModule,
    ]
})
export class SharedModule{}