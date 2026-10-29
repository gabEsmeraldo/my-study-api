import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { SecretKeyGuard } from "./secret-key.guard.js";

function createContext(headers: Record<string, string>): ExecutionContext{
    return {
        switchToHttp: () => ({
            getRequest: () => ({ headers }),
        }),
    } as unknown as ExecutionContext;
}

describe('SecretKeyGuard', () => {
    const guard = new SecretKeyGuard();

    beforeEach(() => {
        vi.stubEnv('API_SECRET_KEY', 'minha-chave')
    })

    afterEach(() => {
        vi.unstubAllEnvs();
    })

    it('deve permitir quando o header x-api-key é igual à chave do .env', () => {
        expect(
            guard.canActivate(createContext({ 'x-api-key': 'minha-chave' }))
        ).toBe(true)
    })

    it('deve bloquear quando a chave é diferente', () => {
        expect(() =>
            guard.canActivate(createContext({ 'x-api-key': 'troque-esta-chave' }))
        ).toThrow(UnauthorizedException)
    })

    it('deve bloquear quando o header não é enviado', () => {
        expect(() => guard.canActivate(createContext({}))).toThrow(UnauthorizedException)
    })

    it('deve bloquear tudo quando API_SECRET_KEY não esta configurada', () => {
        vi.stubEnv('API_SECRET_KEY', '');
        
        expect(() => guard.canActivate(createContext({ 'x-api-key': '' }))).toThrow(UnauthorizedException)
    })
})