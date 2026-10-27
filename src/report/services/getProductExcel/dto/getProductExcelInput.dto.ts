import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetProductExcelInputDTO {
    @ApiProperty({ 
        description: 'Parte do nome do produto (não diferencia maiúsculas)',
        example: 'mouse',
        required: false 
    })
    @IsString()
    @IsOptional()
    search?: string
}