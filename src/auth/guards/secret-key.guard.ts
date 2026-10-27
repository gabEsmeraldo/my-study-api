import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash, timingSafeEqual } from "crypto";
import { Request } from "express";

@Injectable()
export class SecretKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const received_key = request.headers['x-api-key'];
        const expected_key = process.env.API_SECRET_KEY;

        if (
            !expected_key ||
            typeof received_key !== 'string' ||
            !this.safeCompare(received_key, expected_key)
        ) {
            throw new UnauthorizedException('Ação não permitida')
        }

        return true
    }

    private safeCompare(value: string, expected: string): boolean {
        const value_hash = createHash('sha256').update(value).digest();
        const expected_hash = createHash('sha256').update(expected).digest();

        return timingSafeEqual(value_hash, expected_hash)
    }
}