import { Module } from "@nestjs/common";
import { MemoryDatabaseService } from "./services/memoryDatabase.service.js";

@Module({
    providers: [MemoryDatabaseService],
    exports: [MemoryDatabaseService],
})
export class DatabaseModule{}