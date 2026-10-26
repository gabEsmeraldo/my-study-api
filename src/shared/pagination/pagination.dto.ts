import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class PaginationDTO {
    @ApiProperty({ description: "Número da página, começa em 1", example: 1})
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({ 
        description: "Itens por pagina (1 a 100)", 
        example: 10
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    size: number;
}