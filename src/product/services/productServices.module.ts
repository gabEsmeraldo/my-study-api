import { Module } from "@nestjs/common";
import { ProductController } from "../controller/product.controller.js";
import { GetProductService } from "./getProduct/service/getProduct.service.js";
import { GetProductRepository } from "./getProduct/repository/getProduct.repository.js";
import { DatabaseModule } from "../../shared/database/database.module.js";
import { PostProductService } from "./postProduct/service/postProduct.service.js";
import { PostProductRepository } from "./postProduct/repository/postProduct.repository.js";
import { PutProductService } from "./putProduct/service/putProduct.service.js";
import { PutProductRepository } from "./putProduct/repository/putProduct.repository.js";

@Module({
    imports: [DatabaseModule],
    controllers: [ProductController],
    providers: [
        GetProductService,
        GetProductRepository,
        PostProductService,
        PostProductRepository,
        PutProductService,
        PutProductRepository,
    ]
})
export class ProductServicesModule{}