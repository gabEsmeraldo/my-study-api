import { Module } from "@nestjs/common";
import { UserServicesModule } from "./services/userServices.module.js";

@Module({
    imports:[UserServicesModule],
    exports:[UserServicesModule],
})
export class UserModule{}