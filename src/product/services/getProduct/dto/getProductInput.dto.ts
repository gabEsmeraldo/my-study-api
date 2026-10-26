import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "../../../../shared/pagination/pagination.dto.js";

export class GetProductInputDTO extends PaginationDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    search: string
}