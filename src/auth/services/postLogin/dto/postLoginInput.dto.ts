import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PostLoginInputDTO{
    @ApiProperty({
        description: 'Nome de login',
        example: 'admin'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'Senha',
        example: 'admin123'
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}