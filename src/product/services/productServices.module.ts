import { Module } from "@nestjs/common";
import { ProductController } from "../controller/product.controller.js";
import { GetProductService } from "./getProduct/service/getProduct.service.js";
import { GetProductRepository } from "./getProduct/repository/getProduct.repository.js";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { PostProductService } from "./postProduct/service/postProduct.service.js";
import { PostProductRepository } from "./postProduct/repository/postProduct.repository.js";
import { PutProductService } from "./putProduct/service/putProduct.service.js";
import { PutProductRepository } from "./putProduct/repository/putProduct.repository.js";
import { DeleteProductService } from "./deleteProduct/service/deleteProduct.service.js";
import { DeleteProductRepository } from "./deleteProduct/repository/deleteProduct.repository.js";
import { GetProductInMemoryService } from "./getProductInMemory/service/getProductInMemory.service.js";
import { GetProductInMemoryRepository } from "./getProductInMemory/repository/getProductInMemory.repository.js";

@Module({
    imports: [DatabaseModule],
    controllers: [ProductController],
    providers: [
        GetProductService,
        GetProductRepository,
        GetProductInMemoryService,
        GetProductInMemoryRepository,
        PostProductService,
        PostProductRepository,
        PutProductService,
        PutProductRepository,
        DeleteProductService,
        DeleteProductRepository,
    ]
})
export class ProductServicesModule{}