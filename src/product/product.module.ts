import { Module } from "@nestjs/common";
import { ProductServicesModule } from "./services/productServices.module.js";

@Module({
    imports: [ProductServicesModule],
    exports: [ProductServicesModule]
})
export class ProductModule{}