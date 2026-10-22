import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteFileInputDTO{
    @ApiProperty({ example: 'texto.txt'})
    @IsNotEmpty()
    @IsString()
    file_name: string
}