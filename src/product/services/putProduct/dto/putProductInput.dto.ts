import { ApiHideProperty, ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNumber, IsOptional, IsPositive, MaxLength, Min } from "class-validator"

export class PutProductInputDTO{
    @ApiHideProperty()
    product_id: number

    @ApiProperty({ maxLength: 150, example: "Teclado Gamer" })
    @IsOptional()
    @MaxLength(150)
    name?: string

    @ApiProperty({ example: "Teclado Gamer Redragon" })
    @IsOptional()
    description?: string | null

    @ApiProperty({ example: 99.99 })
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    @Type(() => Number)
    @IsPositive()
    price?: number

    @ApiProperty({ example: 5 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock?: number
}