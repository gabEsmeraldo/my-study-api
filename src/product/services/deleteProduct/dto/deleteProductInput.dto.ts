import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteProductInputDTO{
    @ApiProperty({ example: "2" })
    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    product_id: number
}