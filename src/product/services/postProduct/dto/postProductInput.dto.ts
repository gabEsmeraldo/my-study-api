import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, MaxLength, Min } from "class-validator"

export class PostProductInputDTO{
    @ApiProperty({ maxLength: 150, example: "Webcam" })
    @IsNotEmpty()
    @MaxLength(150)
    name: string

    @ApiProperty({ example: "Webcam 4k Gamer Stream Live" })
    @IsOptional()
    description: string | null

    @ApiProperty({ example: 199.99 })
    @IsNotEmpty()
    @IsNumber({maxDecimalPlaces: 2})
    @Type(() => Number)
    @IsPositive()
    price: number

    @ApiProperty({ example: 10 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock: number
}