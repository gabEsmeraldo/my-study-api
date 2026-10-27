import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PROFILES_KEY } from "../decorators/profiles.decorator.js";
import { Request } from "express";
import { Profile } from "../enums/profiles.enum.js";

@Injectable()
export class ProfilesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const required_profiles = this.reflector.getAllAndOverride<Profile[]>(
            PROFILES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if(!required_profiles.length) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user_roles = request.user?.roles ?? [];

        const has_profile = required_profiles.some((profile) =>
            user_roles.includes(profile),
        );

        if(!has_profile) {
            throw new ForbiddenException('Perfil sem permissão para esta ação')
        }

        return true;
    }
}