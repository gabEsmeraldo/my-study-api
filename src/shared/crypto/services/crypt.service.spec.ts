import { CryptoService } from "./crypto.service.js"
import { InternalServerErrorException } from "@nestjs/common";

describe('CryptoService', () => {
    let cryptoService: CryptoService;

    beforeEach(() => {
        vi.stubEnv('DATA_ENCRYPTION_KEY', 'a'.repeat(64));
        cryptoService = new CryptoService();
    })

    afterEach(() => {
        vi.unstubAllEnvs();
    })

    describe('hashPassword / comparePassword', () => {
        it('deve gerar um hash diferente da senha e validar a senha correta', async () => {
            const hash = await cryptoService.hashPassword('admin123');

            expect(hash).not.toContain('admin123');
            expect(hash.split(':')).toHaveLength(2);
            await expect(
                cryptoService.comparePassword('admin123', hash),
            ).resolves.toBe(true);
        });

        it('deve recusar uma senha errada', async () => {
            const hash = await cryptoService.hashPassword('admin123');

            await expect(cryptoService.comparePassword('errada', hash)).resolves.toBe(false)
        })

        it('deve gerar hashes diferentes da mesma senha com (salt aleatório)', async () => {
            const first_hash = await cryptoService.hashPassword('admin123')
            const second_hash = await cryptoService.hashPassword('admin123')
            
            expect(first_hash).not.toBe(second_hash);
        })

        it('deve retornar false para um hash mal formatado', async () =>{
            await expect(
                cryptoService.comparePassword('admin123', 'sem-separador'),
            ).resolves.toBe(false);
        })
    })

    describe('encryptData / decryptData', () => {
        it('deve criptografar e descriptografar o mesmo valor', () => {
            const encrypted = cryptoService.encryptData('12345678909')
            expect(encrypted).not.toContain('12345678909')
            expect(cryptoService.decryptData(encrypted)).toBe('12345678909')
        })

        it('deve falhar ao descriptografar um conteúdo adulterado (GCM valida a integridade)', () => {
            const [iv, auth_tag] = cryptoService
                .encryptData('12345678909')
                .split(':')
            const tampered = [
                iv,
                auth_tag,
                Buffer.from('outro').toString('base64')
            ].join(':')

            expect(() => cryptoService.decryptData(tampered)).toThrow();
        })

        it('deve lançar um erro quando a chave não está configurada', () => {
            vi.stubEnv('DATA_ENCRYPTION_KEY', '');

            expect(() => cryptoService.encryptData('teste')).toThrow(
                InternalServerErrorException,
            )
        })
    })

    describe('encodeBase64 / decodeBase64', () => {
        it('deve codificar e decodificar (não é criptografia!)', () => {
            const encoded = cryptoService.encodeBase64('olá mundo');

            expect(encoded).toBe('b2zDoSBtdW5kbw==')
            expect(cryptoService.decodeBase64(encoded)).toBe('olá mundo');
        });
    });
});