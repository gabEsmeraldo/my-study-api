import { ApiProperty } from "@nestjs/swagger";
import { PaginationDTO } from "../../../../shared/pagination/pagination.dto.js";
import { IsInt, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class GetUserInputDTO extends PaginationDTO{
    @ApiProperty({
        description: 'Parte do username ou do e-mail',
        example: 'admin',
        required: false,
    })
    @IsString()
    @IsOptional()
    search?: string

    @ApiProperty({
        description: 'Filtra por um id de usuário',
        example: 1,
        required: false,
    })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    user_id: number;
}