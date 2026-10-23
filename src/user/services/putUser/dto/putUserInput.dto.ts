import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Profile } from "../../../../auth/enums/profiles.enum.js";

export class PutUserInputDTO {
    @ApiHideProperty()
    user_id: number

    @ApiProperty({
        description: 'Novo nome de login (5 a 100 caracteres)',
        example: 'joao.santos',
        required: false
    })
    @IsString()
    @MinLength(5, { message: "Usuário muito curto"})
    @MaxLength(100, { message: "Usuário muito longo"})
    @IsOptional()
    username?: string

    @ApiProperty({ 
        description: "Novo E-mail", 
        example: "joao.santos@email.com",
        required: false
    })
    @IsOptional()
    @IsEmail({}, { message: "Email inválido"})
    @MaxLength(320)
    email?: string

    @ApiProperty({
        description: "Nova Senha (minimo 6 caracteres)",
        example: "123456", minLength: 6,
        required: false
    })
    @IsOptional()
    @MinLength(6, { message: "Senha muito curta" })
    password?: string

    @ApiProperty({ 
        description: "Novo CPF, só numeros",
        example: "12345678909",
        required: false
    })
    @IsOptional()
    @Matches(/^\d{11}$/, { message: "CPF deve ter 11 digitos numéricos"})
    document?: string

    @ApiProperty({ 
        description: "Perfil do usuário",
        example: "DEFAULT",
        required: false
    })
    @IsEnum(Profile)
    @IsOptional()
    role?: Profile

    @ApiProperty({
        description: "Nova situação: A (Ativo) ou I (Inativo)",
        enum: ['A', 'I'],
        required: false
    })
    @IsIn(['A','I'])
    @IsOptional()
    status?: string;
}