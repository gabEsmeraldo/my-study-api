import { Injectable } from "@nestjs/common";
import { GetProductExcelRepository } from "../repository/getProductExcel.repository.js";
import { GetProductExcelInputDTO } from "../dto/getProductExcelInput.dto.js";
import { GetProductExcelDataDTO } from "../dto/getProductExcelData.dto.js";
import ExcelJS from 'exceljs';

const CURRENCY_FORMAT = '"R$" #,##0.00';

@Injectable()
export class GetProductExcelService{
    constructor(private readonly getProductExcelRepository: GetProductExcelRepository){}

    async execute(dto: GetProductExcelInputDTO): Promise<Buffer> {
        const products = await this.getProductExcelRepository.getProducts(dto);

        return await this.buildWorkBook(products);
    }

    private async buildWorkBook(products: GetProductExcelDataDTO[]): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'my-study-api';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Produtos', {
            views: [{ state: 'frozen', ySplit: 1}]
        });

        worksheet.columns = [
            {header: 'ID', key: 'product_id', width: 8},
            {header: 'Produto', key: 'name', width: 40},
            {header: 'Preço', key: 'price', width: 15, style: { numFmt: CURRENCY_FORMAT }},
            {header: 'Estoque', key: 'stock', width: 12},
            {header: 'Valor em estoque', key: 'stock_value', width: 20, style: { numFmt: CURRENCY_FORMAT }},
        ];

        const header_row = worksheet.getRow(1);
        header_row.font = {bold: true, color: { argb: 'FFFFFFFF'}}
        header_row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FF1F4E79'},
        };

        products.forEach((product, index) => {
            const row_number = index + 2;

            worksheet.addRow({
                ...product,
                stock_value: {
                    formula: `C${row_number}*D${row_number}`,
                    result: product.price * product.stock,
                },
            });
        });

        const last_data_row = products.length + 1;

        const total_row = worksheet.addRow({
            name: 'TOTAL',
            stock: { formula: `SUM(D2:D${last_data_row})`},
            stock_value: { formula: `SUM(E2:E${last_data_row})`},
        });
        total_row.font = { bold: true };

        worksheet.autoFilter = { from: 'A1', to: 'E1' };

        const array_buffer = await workbook.xlsx.writeBuffer();

        return Buffer.from(array_buffer);
    };
}