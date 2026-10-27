import { Injectable } from "@nestjs/common";
import { GetProductPdfRepository } from "../repository/getProductPdf.repository.js";
import PDFDocument from 'pdfkit';
import { GetProductPdfInputDTO } from "../dto/getProductPdfInput.dto.js";
import { GetProductPdfDataDTO } from "../dto/getProductPdfData.dto.js";

const COLUMNS = [
    { title: 'ID', x: 50, width: 40, align: 'left'},
    { title: 'Produto', x: 95, width: 250, align: 'left'},
    { title: 'Preço', x: 350, width: 90, align: 'right'},
    { title: 'Estoque', x: 445, width: 100, align: 'right'},
] as const;

const ROW_HEIGHT = 20;
const TABLE_LEFT = 45;
const TABLE_WIDTH = 505;

@Injectable()
export class GetProductPdfService{
    constructor(private readonly getProductPdfRepository: GetProductPdfRepository){}

    async execute(dto: GetProductPdfInputDTO): Promise<Buffer> {
        const products = await this.getProductPdfRepository.getProducts(dto);

        return await this.buildPdf(products);
    }


    buildPdf(products: GetProductPdfDataDTO[]): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 50});
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject)

            this.drawReport(doc, products);

            doc.end();
        })
    }

    private drawReport(
        doc: PDFKit.PDFDocument,
        products: GetProductPdfDataDTO[],
    ) {
        const page_bottom = doc.page.height - doc.page.margins.bottom;

        doc.fontSize(18).font('Helvetica-Bold').text('Relatório de Produtos', {align: 'center'})
        const generated_at = new Date().toLocaleString('pt-BR', {timeZone: 'America/Sao_paulo'})

        doc
            .moveDown(0.5)
            .fontSize(10)
            .font('Helvetica')
            .text(`Gerado em: ${generated_at}`, {align: 'center'})
        doc.moveDown(1.5);

        let y = this.drawTableHeader(doc, doc.y)

        products.forEach((product, index) => {
            if (y + ROW_HEIGHT > page_bottom) {
                doc.addPage()
                y = this.drawTableHeader(doc, doc.page.margins.top)
            }

            if(index % 2 === 0) {
                doc.rect(TABLE_LEFT, y-4, TABLE_WIDTH, ROW_HEIGHT).fill('#f2f2f2')
            }

            doc.fillColor('#000000').fontSize(10).font('Helvetica');
            this.drawRow(doc, y, [
                String(product.product_id),
                product.name,
                this.formatCurrency(product.price),
                String(product.stock)
            ]);

            y+= ROW_HEIGHT;
        })

        const total_stock_value = products.reduce(
            (total, product) => total + product.price * product.stock,
            0,
        );

        if (y + 50 > page_bottom) {
            doc.addPage();
            y = doc.page.margins.top;
        }

        doc 
            .moveTo(TABLE_LEFT, y + 4)
            .lineTo(TABLE_LEFT + TABLE_WIDTH, y + 4)
            .stroke()

        doc
            .fillColor('#000000')
            .font('Helvetica-Bold')
            .text(`Total de produtos: ${products.length}`, 50, y + 12)
            .text(`Valor total de estoque: ${this.formatCurrency(total_stock_value)}`, 50, y + 28)
    }

    private drawTableHeader(doc: PDFKit.PDFDocument, y: number): number {
        doc.rect(TABLE_LEFT, y - 4, TABLE_WIDTH, ROW_HEIGHT).fill('#1f4e79');
        doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
        this.drawRow(doc, y, COLUMNS.map((column) => column.title))
        doc.fillColor('#000000')
        return y + ROW_HEIGHT;
    }

    private drawRow(doc: PDFKit.PDFDocument, y: number, values: string[]) {
        COLUMNS.forEach((column, index) => {
            doc.text(values[index], column.x, y, {
                width: column.width,
                align: column.align,
                height: doc.currentLineHeight(),
                ellipsis: true,
            });
        });
    }

    private formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    }
}