import { Controller, Get } from '@nestjs/common';
import { OracleDatabaseService } from './shared/database/services/oracleDatabase.service.js';
import { PostgresDatabaseService } from './shared/database/services/postgresDatabase.service.js';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly db_oracle: OracleDatabaseService,
    private readonly db_postgres: PostgresDatabaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Verifica se a api e os dois bancos estão no ar'})
  @ApiOkResponse({
    description: 'Data/hora de cada banco, ou "offline" se ele não responder',
    schema: {
      example: {
        api: 'ok',
        oracle: '2026-10-20T12:00:00.000Z',
        postgres: '2026-10-20T12:00:00.000Z',
      },
    },
  })
  async getHealth() {
    const oracle = await this.db_oracle.findOne<{ sysdate: Date }>('SELECT SYSDATE FROM DUAL')
      .catch(() => undefined);
    const postgres = await this.db_postgres.findOne<{ now: Date }>('SELECT NOW() AS now')
      .catch(() => undefined);

    return {
      api: 'ok',
      oracle: oracle?.sysdate ?? 'offline',
      postgres: postgres?.now ?? 'offline',
    }
  }

}
