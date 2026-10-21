import { Injectable } from "@nestjs/common"

export class ProductRow {
    product_id: number
    name: string
    description: string | null
    price: number
    stock: number
    created_at: Date
}

@Injectable()
export class MemoryDatabaseService{
    constructor(){}
    private count_id: number = 5
    public products: ProductRow[] = [
        {
            "product_id": 1,
            "name": "Mouse",
            "description": null,
            "price": 50,
            "stock": 5,
            "created_at": new Date()
        },
        {
            "product_id": 2,
            "name": "teclado",
            "description": null,
            "price": 150,
            "stock": 3,
            "created_at": new Date()
        },
        {
            "product_id": 3,
            "name": "Monitor",
            "description": null,
            "price": 900,
            "stock": 2,
            "created_at": new Date()
        },
        {
            "product_id": 4,
            "name": "Mousepad",
            "description": null,
            "price": 30,
            "stock": 9,
            "created_at": new Date()
        },
        {
            "product_id": 5,
            "name": "Headset",
            "description": null,
            "price": 250,
            "stock": 4,
            "created_at": new Date()
        },
    ]
    public nextProductId(): number{
        return ++this.count_id;
    }
}