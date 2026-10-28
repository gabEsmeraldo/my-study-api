import { ApiProperty } from "@nestjs/swagger";
import { PaginationOutputDTO } from "../../../../shared/pagination/paginationOutput.dto.js";
import { GetProductDataDTO } from "../../getProduct/dto/getProductData.dto.js";

export class GetProductInMemoryOutputDTO extends PaginationOutputDTO<GetProductDataDTO>{
    @ApiProperty({ description: 'Produtos da página', type: [GetProductDataDTO]})
    data: GetProductDataDTO[];
}