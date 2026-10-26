export interface IDatabase<TConnection, TBinds> {
    createPoll(): Promise<void>

    open(): Promise<TConnection>;

    commitAndClose(connection: TConnection): Promise<void>

    rollbackAndClose(connection: TConnection): Promise<void>

    closePoll(): Promise<void>

    query<T>(
        sql: string,
        binds?: TBinds,
        connection?: TConnection | null,
    ): Promise<T[]>;

    findOne<T>(
        sql: string,
        binds?: TBinds,
        connection?: TConnection | null,
    ): Promise<T | undefined>;
}