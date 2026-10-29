import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { CryptoService } from "../../../../shared/crypto/services/crypto.service.js";
import { OracleDatabaseService } from "../../../../shared/database/services/oracleDatabase.service.js";
import { PostUserInputDTO } from "../dto/postUserInput.dto.js";
import { PostUserRepository } from "../repository/postUser.repository.js";
import { PostUserService } from "./postUser.service.js"
import { Test } from '@nestjs/testing';

describe('PostUserService', () => {
    let postUserService: PostUserService

    const transaction = { id: 'conexao-fake'}

    const postUserRepository = {
        verifyUsername: vi.fn(),
        verifyEmail: vi.fn(),
        insertUser: vi.fn(),
    };

    const database = {
        open: vi.fn().mockResolvedValue(transaction),
        commitAndClose: vi.fn(),
        rollbackAndClose: vi.fn(),
    }
    const cryptoService = {
        hashPassword: vi.fn().mockResolvedValue('salt:hash'),
        encryptData: vi.fn().mockResolvedValue('documento-cifrado'),
    }
    const dto: PostUserInputDTO = {
        username: 'joao.silva',
        email: 'joao@email.com',
        password: 'senha123',
        document: '12345678909',
    }

    beforeEach(async () => {
        vi.clearAllMocks();
        postUserRepository.verifyUsername.mockResolvedValue(undefined);
        postUserRepository.verifyEmail.mockResolvedValue(undefined);

        const module = await Test.createTestingModule({
            providers: [
                PostUserService,
                { provide: PostUserRepository, useValue: postUserRepository },
                { provide: OracleDatabaseService, useValue: database },
                { provide: CryptoService, useValue: cryptoService },
            ]
        }).compile();

        postUserService = module.get(PostUserService);
    });

    it('deve salvar a senha com hash, o documento criptografado e fazer commit', async () => {
        postUserRepository.insertUser.mockResolvedValue(10);

        const result = await postUserService.execute(dto);

        expect(result).toEqual({ user_id: 10 });
        expect(postUserRepository.insertUser).toHaveBeenCalledWith(
            'joao.silva',
            'joao@email.com',
            'salt:hash',
            'documento-cifrado',
            'DEFAULT',
            transaction,
        );
        expect(database.commitAndClose).toHaveBeenCalledWith(transaction);
        expect(database.rollbackAndClose).not.toHaveBeenCalled();
    });

    it('deve recusar username já cadastrado sem abrir transação', async () => {
        postUserRepository.verifyUsername.mockResolvedValue(1);

        await expect(postUserService.execute(dto)).rejects.toThrow(
            BadRequestException
        )
        expect(database.open).not.toHaveBeenCalled();
    });

    it('deve recusar email já cadastrado sem abrir transação', async () => {
        postUserRepository.verifyEmail.mockResolvedValue(1);

        await expect(postUserService.execute(dto)).rejects.toThrow(
            BadRequestException
        )
        expect(database.open).not.toHaveBeenCalled();
    });

    it('deve fazer rollback quando o insert falha', async () => {
        postUserRepository.insertUser.mockRejectedValue(new Error('ORA-00001'));

        await expect(postUserService.execute(dto)).rejects.toThrow(
            InternalServerErrorException,
        )
        expect(database.rollbackAndClose).toHaveBeenCalledWith(transaction)
        expect(database.commitAndClose).not.toHaveBeenCalled()
    })
})