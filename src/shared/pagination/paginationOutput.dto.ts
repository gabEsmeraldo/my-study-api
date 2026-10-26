import { ApiProperty } from "@nestjs/swagger";

export abstract class PaginationOutputDTO<T>{
    @ApiProperty({
        description: 'Total de itens encontrados (todas as paginas)',
        example: 10,
    })
    total: number;

    @ApiProperty({
        description: 'Pagina devolvida',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Itens por pagina',
        example: 10,
    })
    size: number;

    @ApiProperty({
        description: 'Total de paginas',
        example: 1,
    })
    total_pages: number;

    abstract data: T[];
}