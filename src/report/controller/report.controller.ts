import { Controller, Get, Query, StreamableFile, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProduces, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { GetProductExcelService } from "../services/getProductExcel/service/getProductExcel.service.js";
import { GetProductExcelInputDTO } from "../services/getProductExcel/dto/getProductExcelInput.dto.js";
import { GetProductPdfService } from "../services/getProductPdf/service/getProductPdf.service.js";

@ApiTags('Reports')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({ description: 'Token ausente, inválido ou expirado'})
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController{
    constructor(
        private readonly getProductExcelService: GetProductExcelService,
        private readonly getProductPdfService: GetProductPdfService,
    ){}

    @Get('product/excel')
    @ApiOperation({ summary: 'Baixa a planilha de produtos (.xslx)'})
    @ApiProduces(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    @ApiOkResponse({
        description: 'Arquivo products.xlsx',
        schema: { type: 'string', format: 'binary'}
    })
    async getProductExcel(@Query() data: GetProductExcelInputDTO): Promise<StreamableFile> {
        const buffer = await this.getProductExcelService.execute(data);
        
        return new StreamableFile(buffer, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: 'attachment; filename="products.xlsx"',
        });
    }


    @Get('product/pdf')
    @ApiOperation({ summary: 'Baixa o relátorio de produtos em pdf'})
    @ApiProduces(
        'application/pdf',
    )
    @ApiOkResponse({
        description: 'Arquivo products.pdf',
        schema: { type: 'string', format: 'binary'}
    })
    async getProductPdf(@Query() data: GetProductExcelInputDTO): Promise<StreamableFile> {
        const buffer = await this.getProductPdfService.execute(data);
        
        return new StreamableFile(buffer, {
            type: 'application/pdf',
            disposition: 'attachment; filename="products.pdf"',
        });
    }
}