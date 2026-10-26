import { ApiProperty } from "@nestjs/swagger";
import { PaginationOutputDTO } from "../../../../shared/pagination/paginationOutput.dto.js";
import { GetUserDataDTO } from "./getUserData.dto.js";

export class GetUserOutputDTO extends PaginationOutputDTO<GetUserDataDTO>{
    @ApiProperty({ 
        description: 'Usuários da pagina',
        type: [GetUserDataDTO]
    })
    data: GetUserDataDTO[];
}