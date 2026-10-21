import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class GetProductInputDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    search: string
}