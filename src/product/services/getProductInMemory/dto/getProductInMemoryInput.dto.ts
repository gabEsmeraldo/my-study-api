import { ApiProperty } from "@nestjs/swagger";
import { PaginationDTO } from "../../../../shared/pagination/pagination.dto.js";
import { IsIn, IsOptional, IsString } from "class-validator";

export class GetProductInMemoryInputDTO extends PaginationDTO{
    @ApiProperty({
        description: 'Parte do nome do produto',
        example: 'produto',
        required: false,
    })
    @IsString()
    @IsOptional()
    search?: string

    @ApiProperty({
        description: 'Ordem alfabética pelo nome (padrão ASC)',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
        required: false,
    })
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    alphabetic?: 'ASC' | 'DESC'
}