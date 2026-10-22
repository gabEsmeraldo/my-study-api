import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, MaxLength } from "class-validator";

export class PostFileInputDTO{
    @ApiProperty({ type: 'string', format: 'binary' })
    file: Express.Multer.File

    @ApiProperty({ example: "Arquivo com questões sobre nestjs" })
    @IsOptional()
    @MaxLength(500)
    description?: string
}