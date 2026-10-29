import { BadRequestException } from "@nestjs/common";
import { PostFileService } from "./postFile.service.js";
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

function createMulterFile(
    originalname: string,
    mimetype: string,
    content = 'conteudo',
): Express.Multer.File {
    const buffer = Buffer.from(content);

    return {
        originalname,
        mimetype,
        buffer,
        size: buffer.length
    } as Express.Multer.File;
}

describe('PostFileService', () => {
    const service = new PostFileService();
    let storage_path: string;

    beforeEach(async () => {
        storage_path = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'storage-'),
        );
        vi.stubEnv('FILE_SERVER_PATH', storage_path);
    })

    afterEach(async () => {
        vi.unstubAllEnvs();
        await fs.promises.rm(storage_path, { recursive: true, force: true })
    });

    it('deve salvar o arquivo em disco com nome sanitizado', async () => {
        const result = await service.execute({
            file: createMulterFile('Meu Relatório (final).PDF', 'application/pdf'),
        });

        expect(result.file_name).toMatch(/^\d+-Meu_Relatorio_final_|.pdf$/);

        const saved = await fs.promises.readFile(
            path.join(storage_path, result.file_name),
            'utf8',
        );
        expect(saved).toBe('conteudo');
    });

    it('deve salvar a descrição em um .txt ao lado do arquivo', async () => {
        const result = await service.execute({
            file: createMulterFile('foto.png', 'image/png'),
            description: 'Foto de perfil',
        });

        const description = await fs.promises.readFile(
            path.join(storage_path, `${result.file_name}.txt`),
            'utf8'
        );
        expect(description).toBe('Foto de perfil')
    });

    it('deve recusar tipos de arquivos não permitidos', async () => {
        await expect(
            service.execute({
                file: createMulterFile('script.sh', 'application/x-sh'),
            }),
        ).rejects.toThrow(BadRequestException);
    });

    it('deve recusar quando nenhum arquivo foi enviado', async () => {
        await expect(
            service.execute({ file: undefined as unknown as Express.Multer.File }),
        ).rejects.toThrow('Arquivo não informado')
    });
});