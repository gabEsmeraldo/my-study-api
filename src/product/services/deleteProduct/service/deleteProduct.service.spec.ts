import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { DeleteProductRepository } from "../repository/deleteProduct.repository.js";
import { DeleteProductService } from "./deleteProduct.service.js";

describe('DeleteProductService', () => {
    const repository = { deleteProduct: vi.fn() };

    const service = new DeleteProductService(
        repository as unknown as DeleteProductRepository,
    )

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve remover um produto existente', async () => {
        repository.deleteProduct.mockResolvedValue(5);

        await expect(service.execute({ product_id: 5 })).resolves.toEqual({
            product_id: 5,
        });
        expect(repository.deleteProduct).toHaveBeenCalledWith(5);
    })

    it('deve retornar 404 quando o produto não existe', async () => {
        repository.deleteProduct.mockResolvedValue(undefined);

        await expect(service.execute({ product_id: 999 })).rejects.toThrow(
            NotFoundException,
        );
    });
    
    it('deve bloequar a remoção do produto protegido (id 1) sem ir ao banco', async () => {
        await expect(service.execute({ product_id: 1 })).rejects.toThrow(
            ForbiddenException
        )

        expect(repository.deleteProduct).not.toHaveBeenCalled()
    })
});