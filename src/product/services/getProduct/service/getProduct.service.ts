import { Injectable } from "@nestjs/common";
import { GetProductRepository } from "../repository/getProduct.repository.js";

@Injectable()
export class GetProductService{
    constructor(private readonly getProductRepository: GetProductRepository){}

    async execute(){}
}