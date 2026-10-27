import { ApiProperty } from "@nestjs/swagger";

export class PostLoginOutputDTO{
    @ApiProperty({
        description: 'Token JWT para enviar em Authorization: Bearer <token>',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    access_token: string

    @ApiProperty({description: 'Identificador do usuário', example: 1})
    user_id: number;

    @ApiProperty({description: 'Nome de login', example: 'admin'})
    username: string;

    @ApiProperty({description: 'Perfis do usuário', example: ['ADMIN']})
    roles: string[];
}