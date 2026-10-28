import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "../../../../shared/pagination/pagination.dto.js";

export class GetProductInputDTO extends PaginationDTO {
    @ApiProperty({ 
        description: 'Parte do nome do produto (não diferencia maiúsculas)',
        example: 'mouse',
        required: false 
    })
    @IsString()
    @IsOptional()
    search: string

    @ApiProperty({
        description: 'Ordem alfabetica pelo nome (padrão ASC)',
        enum: ['ASC', 'DESC'],
        default: 'ASC',
        required: false,
    })
    @IsIn(['ASC', 'DESC'])
    @IsOptional()
    alphabetic?: 'ASC' | 'DESC'
}