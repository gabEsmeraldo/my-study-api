import { Controller, Delete, Get, Param, StreamableFile } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetFileListService } from "../services/getFileList/service/getFileList.service.js";
import { GetFileListOutputDTO } from "../services/getFileList/dto/getFileListOutput.dto.js";
import { GetFileService } from "../services/getFile/service/getFile.service.js";
import { GetFileInputDTO } from "../services/getFile/dto/getFile.dto.js";
import { DeleteFileInputDTO } from "../services/deleteFile/dto/deleteFile.dto.js";
import { DeleteFileService } from "../services/deleteFile/service/deleteFile.service.js";

@ApiTags('Files')
@Controller('file')
export class FileController{
    constructor(
        private readonly getFileListService: GetFileListService,
        private readonly getFileService: GetFileService,
        private readonly deleteFileService: DeleteFileService,
    ){}

    @Get('file')
    @ApiOperation({ summary: "Lista arquivos existentes"})
    async getFileList(): Promise<GetFileListOutputDTO[]>{
        return await this.getFileListService.execute();
    }

    @Get('file/:file_name')
    @ApiOperation({ summary: "Devolve o arquivo caso existente"})
    async getFile(@Param() data: GetFileInputDTO): Promise<StreamableFile>{
        return await this.getFileService.execute(data);
    }

    @Delete('file/:file_name')
    @ApiOperation({ summary: "Deleta o arquivo"})
    async deleteFile(@Param() data: DeleteFileInputDTO): Promise<void>{
        return await this.deleteFileService.execute(data);
    }
}