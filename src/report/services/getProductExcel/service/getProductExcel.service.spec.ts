import ExcelJS from 'exceljs';
import { GetProductExcelRepository } from "../repository/getProductExcel.repository.js";
import { GetProductExcelService } from "./getProductExcel.service.js";

describe('GetProductExcelService', () => {
    const repository = {
        getProducts: vi.fn().mockResolvedValue([
            { product_id: 1, name: 'Mouse', price: 50, stock: 2 },
            { product_id: 2, name: 'Teclado', price: 150.5, stock: 4 },
        ]),
    };

    const service = new GetProductExcelService(
        repository as unknown as GetProductExcelRepository,
    );

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('deve gerar um .xlsx válido com cabeçalho, linhas e fórmulas', async () => {
        const buffer = await service.execute({});

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(
            buffer as unknown as Parameters<typeof workbook.xlsx.load>[0],
        );

        const worksheet = workbook.getWorksheet('Produtos')!;

        expect(worksheet.getRow(1).getCell(2).value).toBe('Produto')
        expect(worksheet.getRow(2).getCell(2).value).toBe('Mouse')
        expect(worksheet.getRow(3).getCell(3).value).toBe(150.5)
        expect(worksheet.getRow(3).getCell(5).value).toMatchObject({
            formula: 'C3*D3',
            result: 602,
        })
        expect(worksheet.getRow(4).getCell(2).value).toBe('TOTAL')
    })
})