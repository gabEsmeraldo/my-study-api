import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetProductDataDTO } from "../services/getProduct/dto/getProductData.dto.js";
import { GetProductService } from "../services/getProduct/service/getProduct.service.js";
import { GetProductInputDTO } from "../services/getProduct/dto/getProductInput.dto.js";
import { PostProductOutputDTO } from "../services/postProduct/dto/postProductOutput.dto.js";
import { PostProductInputDTO } from "../services/postProduct/dto/postProductInput.dto.js";
import { PostProductService } from "../services/postProduct/service/postProduct.service.js";
import { PutProductInputDTO } from "../services/putProduct/dto/putProductInput.dto.js";
import { PutProductService } from "../services/putProduct/service/putProduct.service.js";

@ApiTags('Products')
@Controller('product')
export class ProductController{
    constructor(
        private readonly getProductService: GetProductService,
        private readonly postProductService: PostProductService,
        private readonly putProductService: PutProductService,
    ){}

    @Get('product')
    @ApiOperation({ summary: "Lista de Produtos" })
    @ApiOkResponse({ type: GetProductDataDTO, isArray: true })
    async getProducts(@Query() data: GetProductInputDTO): Promise<GetProductDataDTO[]>{
        return await this.getProductService.execute(data);
    }

    @Post('product')
    @ApiOperation({ summary: "Adiciona um produto" })
    @ApiBody({ type: PostProductInputDTO})
    @ApiOkResponse({ type: PostProductOutputDTO })
    async postProduct(@Body() data: PostProductInputDTO): Promise<PostProductOutputDTO>{
        return await this.postProductService.execute(data);
    }

    @Put('product/:product_id')
    @ApiOperation({ summary: "Altera um produto existente (apenas campos enviados)" })
    @ApiBody({ type: PutProductInputDTO })
    @ApiOkResponse()
    async putProduct(
        @Param('product_id', ParseIntPipe) product_id: number,
        @Body() data: PutProductInputDTO
    ): Promise<void>{
        data.product_id = product_id;
        return await this.putProductService.execute(data);
    }
}