import { Module } from "@nestjs/common";
import { ProductController } from "../controller/product.controller.js";
import { GetProductService } from "./getProduct/service/getProduct.service.js";
import { GetProductRepository } from "./getProduct/repository/getProduct.repository.js";

@Module({
    controllers: [ProductController],
    providers: [
        GetProductService,
        GetProductRepository,
    ]
})
export class ProductServicesModule{}