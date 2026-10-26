import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostFileInputDTO } from "../dto/postFileInput.dto.js";
import * as fs from 'node:fs/promises'
import { getStoragePath, resolveStorageFilePath } from "../../../../shared/storage/storage.utils.js";
import path from "node:path";
import { PostFileOutputDTO } from "../dto/postFileOutput.dto.js";

const ALLOWED_MIMETYPES = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain']

@Injectable()
export class PostFileService{
    constructor(){}

    async execute(dto: PostFileInputDTO): Promise<PostFileOutputDTO>{
        try {
            if(!dto.file){throw new BadRequestException('Arquivo não informado')};
            if(!ALLOWED_MIMETYPES.includes(dto.file.mimetype)){
                throw new BadRequestException(`O arquivo ${dto.file.originalname} possui um formato inválido`)
            }
            try {
                await fs.access(getStoragePath())
            } catch {
                await fs.mkdir(getStoragePath(), { recursive: true })
            }
            const nome = this.buildFileName(dto.file.originalname)
            await fs.writeFile(resolveStorageFilePath(nome), dto.file.buffer)
            return {
                file_name: nome,
                original_name: dto.file.originalname,
                mimetype: dto.file.mimetype,
                size: dto.file.size
            } as PostFileOutputDTO
        } catch (error) {
            if(error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException(error);
        }
    }

    private buildFileName(original_name: string): string{
        const { name, ext } = path.parse(original_name);
        const sanitized_name = name
            .normalize('NFD')
            .replace(/[ ̀-]/g, '')
            .replace(/[^a-zA-Z0-9-]+/g, '_');
            return `${Date.now()}-${sanitized_name}${ext.toLowerCase()}`
    }
}