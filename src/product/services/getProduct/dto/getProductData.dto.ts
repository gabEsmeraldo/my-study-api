import { ApiProperty } from "@nestjs/swagger"

export class GetProductDataDTO{
    @ApiProperty()
    product_id: number

    @ApiProperty()
    name: string

    @ApiProperty({ type: String, nullable: true })
    description: string | null

    @ApiProperty()
    price: number

    @ApiProperty()
    stock: number
    
    @ApiProperty()
    created_at: Date
}