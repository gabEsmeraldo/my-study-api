import { GetProductInMemoryRepository } from "../repository/getProductInMemory.repository.js"
import { GetProductInMemoryService } from "./getProductInMemory.service.js"

describe('GetProductInMemoryService', () => {
    const products = [
        {
            product_id: 1,
            name: 'Mouse',
            description: null,
            price: 50,
            stock: 5,
            created_at: new Date(),
        },
        {
            product_id: 2,
            name: 'Teclado',
            description: null,
            price: 150,
            stock: 3,
            created_at: new Date(),
        },
        {
            product_id: 3,
            name: 'Monitor',
            description: null,
            price: 900,
            stock: 2,
            created_at: new Date(),
        },
        {
            product_id: 4,
            name: 'Mousepad',
            description: null,
            price: 30,
            stock: 9,
            created_at: new Date(),
        },
    ]

    const repository = { getAllProducts: vi.fn().mockResolvedValue(products)}

    const service = new GetProductInMemoryService(
        repository as unknown as GetProductInMemoryRepository,
    )

    beforeEach(() => {
        vi.clearAllMocks();
    })

    it('deve ordenar e paginar em memória', async () => {
        const result = await service.execute({ page: 1, size: 2});
        expect(result.total).toBe(4);
        expect(result.total_pages).toBe(2);
        expect(result.data.map((product) => product.name)).toEqual([
            'Monitor',
            'Mouse'
        ]);
    });

    it('deve filtrar pelo nome antes de paginar', async () => {
        const result = await service.execute({
            page: 1,
            size: 10,
            search: 'mouse',
        })

        expect(result.total).toBe(2);
        expect(result.data.map((product) => product.name)).toEqual([
            'Mouse',
            'Mousepad',
        ]);
    })

    it('deve respeitar a ordem DESC', async () => {
        const result = await service.execute({
            page: 1,
            size: 1,
            alphabetic: 'DESC',
        })

        expect(result.data[0].name).toBe('Teclado');
    })
})