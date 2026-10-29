import { GetProductPdfRepository } from "../repository/getProductPdf.repository.js";
import { GetProductPdfService } from "./getProductPdf.service.js";

describe('GetProductPdfService', () => {
    const repository = { getProducts: vi.fn() };

    const service = new GetProductPdfService(
        repository as unknown as GetProductPdfRepository,
    );

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve gerar um buffer de PDF', async () => {
        repository.getProducts.mockResolvedValue([
            { product_id: 1, name: 'Mouse', price: 50, stock: 2},
        ])

        const buffer = await service.execute({});

        expect(buffer.subarray(0, 5).toString()).toBe('%PDF-')
    });

    it('deve criar mais de uma página quando há muitos produtos', async () => {
        repository.getProducts.mockResolvedValue(
            Array.from({ length: 80 }, (_, index) => ({
                product_id: index + 1,
                name: `Produto ${index + 1}`,
                price: 10,
                stock: 1,
            })),
        );

        const buffer = await service.execute({});
        const page_count = buffer
            .toString('latin1')
            .match(/\/Type \/Page\b/g)?.length;

        expect(page_count).toBeGreaterThan(1);
    })
})