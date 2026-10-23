import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class DeleteUserInputDTO{
    @ApiProperty({
        description: 'Identificador do usuário a remover',
        example: 2,
    })
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    user_id: number;
}