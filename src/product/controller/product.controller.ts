import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBody, ApiOkResponse, ApiOperation, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { GetProductDataDTO } from "../services/getProduct/dto/getProductData.dto.js";
import { GetProductService } from "../services/getProduct/service/getProduct.service.js";
import { GetProductInputDTO } from "../services/getProduct/dto/getProductInput.dto.js";
import { PostProductOutputDTO } from "../services/postProduct/dto/postProductOutput.dto.js";
import { PostProductInputDTO } from "../services/postProduct/dto/postProductInput.dto.js";
import { PostProductService } from "../services/postProduct/service/postProduct.service.js";
import { PutProductInputDTO } from "../services/putProduct/dto/putProductInput.dto.js";
import { PutProductService } from "../services/putProduct/service/putProduct.service.js";
import { DeleteProductInputDTO } from "../services/deleteProduct/dto/deleteProductInput.dto.js";
import { DeleteProductOutputDTO } from "../services/deleteProduct/dto/deleteProductOutput.dto.js";
import { DeleteProductService } from "../services/deleteProduct/service/deleteProduct.service.js";
import { GetProductOutputDTO } from "../services/getProduct/dto/getProductOutput.dto.js";
import { SecretKeyGuard } from "../../auth/guards/secret-key.guard.js";
import { GetProductInMemoryService } from "../services/getProductInMemory/service/getProductInMemory.service.js";
import { GetProductInMemoryOutputDTO } from "../services/getProductInMemory/dto/getProductInMemoryOutput.dto.js";

@ApiTags('Products')
@Controller('product')
export class ProductController{
    constructor(
        private readonly getProductService: GetProductService,
        private readonly getProductInMemoryService: GetProductInMemoryService,
        private readonly postProductService: PostProductService,
        private readonly putProductService: PutProductService,
        private readonly deleteProductService: DeleteProductService,
    ){}

    @Get('product')
    @ApiOperation({ summary: "Lista de Produtos" })
    @ApiOkResponse({ type: GetProductDataDTO, isArray: true })
    @ApiBadRequestResponse({ description: 'page ou size ausente ou inválido' })
    async getProduct(@Query() data: GetProductInputDTO): Promise<GetProductOutputDTO>{
        return await this.getProductService.execute(data);
    }

    @Get('')
    @ApiOperation({ summary: "Lista de Produtos (Paginação no service)" })
    @ApiOkResponse({
        description: 'Página de produtos ordenada pelo nome', 
        type: GetProductInMemoryOutputDTO 
    })
    @ApiBadRequestResponse({ description: 'page ou size ausente ou inválido' })
    async getProductInMemory(@Query() data: GetProductInputDTO): Promise<GetProductInMemoryOutputDTO>{
        return await this.getProductInMemoryService.execute(data);
    }

    @Post('product')
    @UseGuards(SecretKeyGuard)
    @ApiSecurity('x-api-key')
    @ApiUnauthorizedResponse({description: 'x-api-key ausente ou errada'})
    @ApiOperation({ summary: "Adiciona um produto" })
    @ApiBody({ type: PostProductInputDTO})
    @ApiOkResponse({ type: PostProductOutputDTO })
    async postProduct(@Body() data: PostProductInputDTO): Promise<PostProductOutputDTO>{
        return await this.postProductService.execute(data);
    }

    @Put('product/:product_id')
    @UseGuards(SecretKeyGuard)
    @ApiSecurity('x-api-key')
    @ApiUnauthorizedResponse({description: 'x-api-key ausente ou errada'})
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

    @Delete('product/:product_id')
    @UseGuards(SecretKeyGuard)
    @ApiSecurity('x-api-key')
    @ApiUnauthorizedResponse({description: 'x-api-key ausente ou errada'})
    @ApiOperation({ summary: "Deleta um produto" })
    @ApiBody({ type: DeleteProductInputDTO })
    @ApiOkResponse({ type: DeleteProductOutputDTO })
    async deleteProduct(@Param() dto: DeleteProductInputDTO): Promise<DeleteProductOutputDTO>{
        return await this.deleteProductService.execute(dto)
    }
}