import { Injectable } from "@nestjs/common"

export class ProductRow {
    product_id: number
    name: string
    description: string | null
    price: number
    stock: number
    created_at: Date
}

export class UserRow {
    user_id: number;
    username: string;
    email: string;
    password: string;
    document: string | null;
    role: string;
    status: string
    created_at: Date;
}

@Injectable()
export class MemoryDatabaseService{
    constructor(){}
    private last_product_id: number = 5
    private last_user_id = 1;
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

    public users: UserRow[] = [
        {
            user_id: 1,
            username: 'admin',
            email: 'admin@study.local',
            password: 'c2ded6f0d58c69ed1510791949998402:e8980419364f7e8bd6a4e705cbe38860b903b40910a1c9cb9475ed0228e9e5dd10e200034257ca738e0259cc1e3a41ff7b794205599c4f50fcb9fd7465ad7342',
            document: null,
            role: 'ADMIN',
            status: 'A',
            created_at: new Date(),
        },
    ];
    nextProductId(): number{
        return ++this.last_product_id;
    }

    nextUserId(): number {
        this.last_user_id += 1;
        return this.last_user_id;
    }
}