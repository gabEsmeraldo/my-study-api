import { ApiProperty } from "@nestjs/swagger"

export class GetUserDataDTO{
    @ApiProperty({ description: "Identificador do usuário", example: 1})
    user_id: number

    @ApiProperty({ description: "Nome de login", example: "admin"})
    username: string

    @ApiProperty({ description: "E-mail", example: "admin@email.com"})
    email: string

    @ApiProperty({ 
        description: "CPF (descriptografado na resposta)", 
        example: '12345678909',
        type: String,
        nullable: true,
    })
    document: string | null

    @ApiProperty({ description: "Perfil", example: 'ADMIN'})
    role: string
    
    @ApiProperty({ description: "Situação: A (ativo) ou I (inativo)", example: 'A'})
    status: string

    @ApiProperty({ description: "Data de cadastro", example: '2026-10-20T:00:00.000Z'})
    created_at: Date;
}