import { ApiProperty } from "@nestjs/swagger";
import { PaginationOutputDTO } from "../../../../shared/pagination/paginationOutput.dto.js";
import { GetProductDataDTO } from "./getProductData.dto.js";

export class GetProductOutputDTO extends PaginationOutputDTO<GetProductDataDTO>{
    @ApiProperty({
        description: 'Produtos da página',
        type: [GetProductDataDTO]
    })
    data: GetProductDataDTO[];
}