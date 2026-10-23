import { ApiProperty } from "@nestjs/swagger";

export class PostUserOutputDTO {
    @ApiProperty({ description: "Identificador do usuário criado", example: 2})
    user_id: number
}