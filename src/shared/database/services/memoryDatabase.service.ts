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
            password: 'c68c19691dc2b08807eb817eb97ae918c68c19691dc2b08807eb817eb97ae918:ca93c6e37cce3d8acb7750d52f19091c7b6f9f0b9e85be0b9e590a8ba9ad80bd863e094c2ac99377758377b9f4f832e81c6fa606ef8b4392c203c954d854d06e',
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