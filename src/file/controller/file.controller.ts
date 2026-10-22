import { Body, Controller, Delete, Get, Param, Post, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetFileListService } from "../services/getFileList/service/getFileList.service.js";
import { GetFileListOutputDTO } from "../services/getFileList/dto/getFileListOutput.dto.js";
import { GetFileService } from "../services/getFile/service/getFile.service.js";
import { GetFileInputDTO } from "../services/getFile/dto/getFile.dto.js";
import { DeleteFileInputDTO } from "../services/deleteFile/dto/deleteFile.dto.js";
import { DeleteFileService } from "../services/deleteFile/service/deleteFile.service.js";
import { FileInterceptor } from "@nestjs/platform-express";
import { PostFileInputDTO } from "../services/postFile/dto/postFileInput.dto.js";
import { PostFileService } from "../services/postFile/service/postFile.service.js";

@ApiTags('Files')
@Controller('file')
export class FileController{
    constructor(
        private readonly getFileListService: GetFileListService,
        private readonly getFileService: GetFileService,
        private readonly deleteFileService: DeleteFileService,
        private readonly postFileService: PostFileService,
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

    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 5 * 1024 * 1024},
            defParamCharset: 'utf8',
        }),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: PostFileInputDTO })
    async postFile(@Body() data: PostFileInputDTO, @UploadedFile() file: Express.Multer.File) {
        data.file = file;
        return await this.postFileService.execute(data);
    }
}