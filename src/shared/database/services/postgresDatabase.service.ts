import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import pg, { PoolClient } from 'pg';
import { IDatabase } from '../interfaces/IDatabase.js';
const { Pool, types } = pg;

types.setTypeParser(types.builtins.INT8, (value) => Number(value));
types.setTypeParser(types.builtins.NUMERIC, (value) => Number(value));

@Injectable()
export class PostgresDatabaseService 
    implements IDatabase<pg.PoolClient, unknown[]>, OnModuleInit, OnModuleDestroy
{
    private logger = new Logger('PostgresDatabaseService');

    private pool: pg.Pool;

    async onModuleInit() {
        await this.createPool();
    }

    async onModuleDestroy() {
        await this.closePool();
    }

    async createPool() {
        this.pool = new Pool({
            host: process.env.POSTGRES_DB_HOST,
            port: Number(process.env.POSTGRES_DB_PORT ?? 5432),
            database: process.env.POSTGRES_DB_DATABASE,
            user: process.env.POSTGRES_DB_USER,
            password: process.env.POSTGRES_DB_PASSWORD,
            max: 10,
            idleTimeoutMillis: 60000,
        })
        this.pool.on('error', (err) => this.logger.error(`pool: ${err.message}`));

        this.logger.log('Pool Postgres iniciado!')
    }

    async open(): Promise<pg.PoolClient> {
        const client = await this.pool.connect();
        await client.query('BEGIN');
        return client;
    }

    async commitAndClose(connection: pg.PoolClient) {
        if(!connection) {
            this.logger.error('commitAndClose: Conexão não encontrada')
            return
        }

        try {
            await connection.query('COMMIT')
        } finally {
            connection.release();
        }
    }


    async rollbackAndClose(connection: pg.PoolClient) {
        if(!connection) {
            this.logger.error('rollbackAndClose: Conexão não encontrada')
            return
        }

        try {
            await connection.query('ROLLBACK');
        } finally {
            connection.release();
        }
    }

    async closePool() {
        await this.pool?.end();
        this.logger.warn('closePool: Pool Postgres encerrado.')
    }

    async findOne<T>(
        sql: string,
        binds: unknown[] = [],
        connection?: pg.PoolClient | null,
    ): Promise<T | undefined> {
        const rows = await this.query<T>(sql, binds, connection);
        return rows[0];
    }

    async query<T>(
        sql: string,
        binds: unknown[] = [],
        connection?: pg.PoolClient | null,
    ): Promise<T[]> {
        try {
            const executor = connection ?? this.pool;

            const result = await executor.query(sql, binds)

            if (process.env.DB_LOGGING === 'true') this.logger.debug(sql);

            return result.rows as T[];
        } catch (err) {
            this.logger.error(`query: ${err}`)
            throw err;
        }
    }
}