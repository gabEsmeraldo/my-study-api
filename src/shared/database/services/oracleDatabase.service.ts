import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { IDatabase } from "../interfaces/IDatabase.js";
import oracledb from "oracledb";

@Injectable()
export class OracleDatabaseService
    implements
        IDatabase<oracledb.Connection, oracledb.BindParameters>,
        OnModuleInit,
        OnModuleDestroy
{
    private logger = new Logger('OracleDatabaseService');

    public poolAlias = 'STUDY_ORACLE';

    async onModuleInit() {
        await this.createPool()
    }

    async onModuleDestroy() {
        await this.closePool()
    }

    async createPool() {
        try {
            const host = process.env.ORACLE_DB_HOST;
            const port = process.env.ORACLE_DB_PORT;
            const database = process.env.ORACLE_DB_DATABASE;

            await oracledb.createPool({
                user: process.env.ORACLE_DB_USER,
                password: process.env.ORACLE_DB_PASSWORD,
                connectString: `${host}:${port}/${database}`,
                poolMin: 0,
                poolMax: 10,
                poolIncrement: 1,
                poolTimeout: 60,
                poolAlias: this.poolAlias,
            });

            this.logger.log('Pool Oracle iniciado!')
        } catch (err) {
            this.logger.error(`createPool: ${err}`)
        }
    }

    async open(): Promise<oracledb.Connection> {
        return await oracledb.getConnection(this.poolAlias);
    }

    async commitAndClose(connection: oracledb.Connection): Promise<void> {
        if(!connection) {
            this.logger.error('commitAndClose: Conexão não encontrada.')
            return;
        }

        await connection.commit();
        await connection.close();
    }

    async rollbackAndClose(connection: oracledb.Connection): Promise<void> {
        if(!connection) {
            this.logger.error('rollbackAndClose: Conexão não encontrada.')
            return;
        }

        await connection.rollback();
        await connection.close();
    }

    async closePool(): Promise<void> {
        try {
            await oracledb.getPool(this.poolAlias).close(10);
            this.logger.warn('closePool: Pool Oracle encerrado.')
        } catch {

        }
    }

    async findOne<T>(
        sql: string,
        binds: oracledb.BindParameters = {},
        connection?: oracledb.Connection | null,
    ): Promise<T | undefined> {
        const rows = await this.query<T>(sql, binds, connection);
        return rows[0];
    }

    async query<T>(
        sql: string,
        binds: oracledb.BindParameters = {},
        connection?: oracledb.Connection | null,
    ): Promise<T[]> {
        const is_open_transaction = !!connection;
        const current_connection = connection ?? (await this.open());

        try {
            const result = await current_connection.execute<Record<string, unknown>>(
                sql,
                binds,
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                    autoCommit: !is_open_transaction,
                    maxRows: 1000,
                }
            )
            if (process.env.DB_LOGGING === 'true') this.logger.debug(sql);

            return (result.rows ?? []).map((row) => this.toLowerCaseKeys<T>(row))
        } catch (err) {
            this.logger.error(`query: ${err}`)
            throw err;
        } finally {
            if (!is_open_transaction) await current_connection.close();
        }
    }

    async queryBindOut<T>(
        sql: string,
        binds: oracledb.BindParameters = {},
        connection?: oracledb.Connection | null,
    ): Promise<oracledb.Result<T>> {
        const is_open_transaction = !!connection;
        const current_connection = connection ?? (await this.open());

        try {
            const result = await current_connection.execute<T>(sql, binds,{
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: !is_open_transaction,
            })
            if (process.env.DB_LOGGING === 'true') this.logger.debug(sql);
            return result;
        } catch (err) {
            this.logger.error(`queryBindOut: ${err}`)
            throw err;
        } finally {
            if (!is_open_transaction) await current_connection.close();
        }
    }

    private toLowerCaseKeys<T>(row: Record<string, unknown>): T {
        const new_values: Record<string, unknown> = {};

        Object.keys(row).forEach((key) => {
            new_values[key.toLocaleLowerCase()] = row[key];
        });

        return new_values as T;
    }
}