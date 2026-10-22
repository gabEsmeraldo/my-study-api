import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DeleteFileInputDTO } from "../dto/deleteFile.dto.js";
import { resolveStorageFilePath } from "../../../../shared/storage/storage.utils.js";
import * as fs from 'node:fs/promises';

@Injectable()
export class DeleteFileService{
    
    async execute(dto: DeleteFileInputDTO): Promise<void>{
        try {
            await fs.unlink(resolveStorageFilePath(dto.file_name))
        } catch (error) {
            if (error && typeof error === 'object' && 'code' in error){
                if(error.code === 'ENOENT') throw new NotFoundException('Arquivo não encontrado')
            }
            throw new InternalServerErrorException(error)
        }
    }
}