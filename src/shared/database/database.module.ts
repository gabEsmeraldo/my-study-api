import { Module } from "@nestjs/common";
import { OracleDatabaseService } from "./services/oracleDatabase.service.js";
import { PostgresDatabaseService } from "./services/postgresDatabase.service.js";

@Module({
    providers: [OracleDatabaseService, PostgresDatabaseService],
    exports: [OracleDatabaseService, PostgresDatabaseService],
})
export class DatabaseModule{}