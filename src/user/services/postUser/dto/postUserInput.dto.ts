import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { Profile } from "../../../../auth/enums/profiles.enum.js";

export class PostUserInputDTO{
    @ApiProperty({ 
        description: "Nome de login (5 a 100 caracteres)",
        example: "joao.silva", 
        minLength: 5, 
        maxLength: 100})
    @IsNotEmpty()
    @IsString()
    @MinLength(5, { message: "Usuário muito curto"})
    @MaxLength(100, { message: "Usuário muito longo"})
    username: string

    @ApiProperty({ 
        description: "E-mail", 
        example: "email@email.com"
    })
    @IsNotEmpty()
    @IsEmail({}, { message: "Email inválido"})
    @MaxLength(320)
    email: string

    @ApiProperty({
        description: "Senha (minimo 6 caracteres)",
        example: "123456", minLength: 6})
    @IsNotEmpty()
    @MinLength(6, { message: "Senha muito curta" })
    password: string

    @ApiProperty({ 
        description: "CPF, só numeros",
        example: "12345678909"
    })
    @IsNotEmpty()
    @Matches(/^\d{11}$/, { message: "CPF deve ter 11 digitos numéricos"})
    document: string

    @ApiProperty({ 
        description: "Perfil do usuário",
        example: "DEFAULT",
        required: false,
    })
    @IsEnum(Profile)
    @IsOptional()
    role?: Profile
}