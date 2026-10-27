import { Module } from "@nestjs/common";
import { AuthServicesModule } from "./services/authServices.module.js";

@Module({
    imports:[AuthServicesModule],
    exports:[AuthServicesModule],
})
export class AuthModule{}