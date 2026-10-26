import { PaginationDTO } from "./pagination.dto.js";
import { PaginationOutputDTO } from "./paginationOutput.dto.js";

export function getOffset({ page, size }: PaginationDTO): number {
    return (page - 1) * size;
}

export function buildPaginationOutput<T>(
    data: T[],
    total: number,
    { page, size }: PaginationDTO,
): PaginationOutputDTO<T> {
    return {
        page, 
        size,
        total,
        total_pages: Math.ceil(total / size),
        data,
    };
}

export function paginateInMemory<T>(
    items: T[],
    pagination: PaginationDTO,
): PaginationOutputDTO<T> {
    const offset = getOffset(pagination);

    const data = items.slice(offset, offset + pagination.size);

    return buildPaginationOutput<T>(data, items.length, pagination);
}