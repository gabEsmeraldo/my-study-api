import { Module } from "@nestjs/common";
import { ReportServicesModule } from "./services/reportServices.module.js";

@Module({
    imports: [ReportServicesModule],
    exports: [ReportServicesModule],
})
export class ReportModule {}