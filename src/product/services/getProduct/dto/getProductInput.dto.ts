import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
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
}