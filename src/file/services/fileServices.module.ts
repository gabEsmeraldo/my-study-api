import { Module } from "@nestjs/common";
import { FileController } from "../controller/file.controller.js";
import { GetFileService } from "./getFile/service/getFile.service.js";
import { GetFileListService } from "./getFileList/service/getFileList.service.js";
import { DeleteFileService } from "./deleteFile/service/deleteFile.service.js";

@Module({
    controllers:[FileController],
    providers:[
        GetFileService,
        GetFileListService,
        DeleteFileService,
    ],
})

export class FileServicesModule{}