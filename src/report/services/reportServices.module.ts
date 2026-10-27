import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { ReportController } from "../controller/report.controller.js";
import { GetProductExcelService } from "./getProductExcel/service/getProductExcel.service.js";
import { GetProductExcelRepository } from "./getProductExcel/repository/getProductExcel.repository.js";
import { GetProductPdfService } from "./getProductPdf/service/getProductPdf.service.js";
import { GetProductPdfRepository } from "./getProductPdf/repository/getProductPdf.repository.js";

@Module({
    imports: [DatabaseModule],
    controllers: [ReportController],
    providers: [
        GetProductExcelService,
        GetProductExcelRepository,
        GetProductPdfService,
        GetProductPdfRepository,
    ]
})
export class ReportServicesModule{}