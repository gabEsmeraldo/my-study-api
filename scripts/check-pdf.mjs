import 'reflect-metadata';
import * as fs from 'node:fs';
import { GetProductPdfService } from '../dist/report/services/getProductPdf/service/getProductPdf.service.js'

const service = new GetProductPdfService(null);
const products = Array.from({ length: 80 }, (_, index) => ({
    product_id: index + 1,
    name: `Produto ${index + 1}`,
    price: 10,
    stock: 1,
}))

const buffer = await service.buildPdf(products);
fs.writeFileSync('teste-80-produtos.pdf', buffer);
console.log('primeiros bytes:', buffer.subarray(0, 5).toString())