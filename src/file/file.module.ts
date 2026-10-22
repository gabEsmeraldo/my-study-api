import { Module } from "@nestjs/common";
import { FileServicesModule } from "./services/fileServices.module.js";

@Module({
    imports:[FileServicesModule],
    exports:[FileServicesModule],
})

export class FileModule{}