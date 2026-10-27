import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { ReportController } from "../controller/report.controller.js";
import { GetProductExcelService } from "./getProductExcel/service/getProductExcel.service.js";
import { GetProductExcelRepository } from "./getProductExcel/repository/getProductExcel.repository.js";

@Module({
    imports: [DatabaseModule],
    controllers: [ReportController],
    providers: [
        GetProductExcelService,
        GetProductExcelRepository,
    ]
})
export class ReportServicesModule{}