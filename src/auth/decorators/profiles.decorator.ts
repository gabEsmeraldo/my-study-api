import { SetMetadata } from "@nestjs/common";
import { Profile } from "../enums/profiles.enum.js";

export const PROFILES_KEY = 'roles';

export const Profiles = (...profiles: Profile[]) =>
    SetMetadata(PROFILES_KEY, profiles);