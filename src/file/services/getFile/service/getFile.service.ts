import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common";
import * as fs from 'node:fs'
import { getContentType, getStoragePath, resolveStorageFilePath } from "../../../../shared/storage/storage.utils.js";
import { GetFileInputDTO } from "../dto/getFile.dto.js";

@Injectable()
export class GetFileService{
    
    async execute(dto: GetFileInputDTO): Promise<StreamableFile>{
        const file_path = resolveStorageFilePath(dto.file_name);

        try {
            await fs.promises.access(file_path);
        }catch {
            try {
                await fs.promises.access(getStoragePath())
            } catch {
                await fs.promises.mkdir(getStoragePath(), { recursive: true })
                throw new NotFoundException('Pasta não existia e foi criada mas arquivo não foi encontrado!')
            }
            throw new NotFoundException('Arquivo não encontrado!')
        }

        return new StreamableFile(fs.createReadStream(file_path), {
            type: getContentType(dto.file_name),
            disposition: `inline; filename*=UTF-8''${encodeURIComponent(dto.file_name)}`,
        });
    }
}