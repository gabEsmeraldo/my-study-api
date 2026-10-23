import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt) as (
    password: string,
    salt: Buffer,
    key_length: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ALGORITHM = 'aes-256-gcm';

@Injectable()
export class CryptoService {
    
    async hashPassword(password: string): Promise<string>{
        const salt = randomBytes(SALT_LENGTH);
        const hash = await scryptAsync(password, salt, KEY_LENGTH);

        return `${salt.toString('hex')}:${hash.toString('hex')}`
    }

    async comparePassword(
        password: string,
        stored_hash: string,
    ): Promise<boolean> {
        const [salt_hex, hash_hex] = stored_hash?.split(':') ?? [];

        if(!salt_hex || !hash_hex) return false;

        const stored_buffer = Buffer.from(hash_hex, 'hex');

        const hash = await scryptAsync(
            password,
            Buffer.from(salt_hex, 'hex'),
            stored_buffer.length,
        );

        return timingSafeEqual(hash, stored_buffer)
    }


    encryptData(plain_text: string): string {
        const iv = randomBytes(IV_LENGTH);
        const cipher = createCipheriv(ALGORITHM, this.getEncryptionKey(), iv);
         const encrypted = Buffer.concat([
            cipher.update(plain_text, 'utf8'),
            cipher.final(),
         ]);

        const auth_tag = cipher.getAuthTag();

        return [iv, auth_tag, encrypted]
            .map((part) => part.toString('base64'))
            .join(':');
    }

    decryptData(encrypted_text: string): string {
        const [iv, auth_tag, encrypted] = encrypted_text
            .split(':')
            .map((part) => Buffer.from(part, 'base64'))

        const decipher = createDecipheriv(ALGORITHM, this.getEncryptionKey(), iv)
        decipher.setAuthTag(auth_tag)

        return Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]).toString('utf8');
    }

    encodeBase64(text: string): string {
        return Buffer.from(text, 'utf8').toString('base64');
    }

    decodeBase64(encoded_text: string): string {
        return Buffer.from(encoded_text, 'base64').toString('utf8')
    }

    private getEncryptionKey(): Buffer {
        const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY ?? '', 'hex')
        if (key.length !== 32) {
            throw new InternalServerErrorException(
                'DATA_ENCRYPTION_KEY deve ter 32 bytes em hexadecimal (64 caracteres)',
            );
        }
        return key;
    }
}