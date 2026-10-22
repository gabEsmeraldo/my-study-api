import { Injectable } from "@nestjs/common";
import * as fs from 'node:fs/promises';
import { getStoragePath } from "../../../../shared/storage/storage.utils.js";
import path from "node:path";
import { GetFileListOutputDTO } from "../dto/getFileListOutput.dto.js";

@Injectable()
export class GetFileListService{
    constructor(){}
    
    async execute(): Promise<GetFileListOutputDTO[]>{
        const storage_path = getStoragePath();
        const entries = await fs.readdir(storage_path, { withFileTypes: true }); 
        const files = entries.filter((entry) => entry.isFile() && !entry.name.startsWith('.')); 
        const list = await Promise.all( 
            files.map(async (entry) => { 
                const stats = await fs.stat(path.join(storage_path, entry.name)); 
                return { 
                    file_name: entry.name, 
                    extension: path.extname(entry.name), 
                    size: stats.size, 
                    created_at: stats.birthtime}
                }
            )
        )
        return list.sort(function(a, b): any{
            return b.created_at.getTime() - a.created_at.getTime();
        });
    }
}