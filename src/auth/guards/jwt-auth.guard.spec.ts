import { JwtService } from "@nestjs/jwt"
import { JwtAuthGuard } from "./jwt-auth.guard.js"
import { ExecutionContext, UnauthorizedException } from "@nestjs/common"

describe('JwtAuthGuard', () => {
    const jwtService = new JwtService({ secret: 'segredo-de-teste' })
    const guard = new JwtAuthGuard(jwtService)

    function createContext(authorization?: string) {
        const request: { headers: Record<string, string>; user?: unknown } ={
            headers: authorization ? { authorization } : {},
        }

        const context = {
            switchToHttp: () => ({ getRequest: () => request })
        } as unknown as ExecutionContext;

        return { context, request };
    }

    it('deve aceitar um token válido e preencher request.user', async () => {
        const token = await jwtService.signAsync({
            user_id: 1,
            username: 'admin',
            roles: ['ADMIN'],
        })
        const { context, request } = createContext(`Bearer ${token}`)

        await expect(guard.canActivate(context)).resolves.toBe(true)
        expect(request.user).toEqual({
            user_id: 1,
            username: 'admin',
            roles: ['ADMIN'],
        });
    });

    it('deve recusar requisição sem token', async () => {
        const { context } = createContext();

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        )
    })

    it('deve recusar token assinado com outro segredo', async () => {
        const token = await new JwtService({ secret: 'outro' }).signAsync({
            user_id: 1,
        })

        const { context } = createContext(`Bearer ${token}`)

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        )
    })

    it('deve recusar token expirado', async () => {
        const token = await jwtService.signAsync(
            { user_id: 1 },
            { expiresIn: '-1s'},
        )

        const { context } = createContext(`Bearer ${token}`)

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException
        )
    })
})