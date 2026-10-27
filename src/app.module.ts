import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module.js';
import { ProductModule } from './product/product.module.js';
import { FileModule } from './file/file.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ReportModule } from './report/report.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    SharedModule,
    ProductModule,
    FileModule,
    UserModule,
    AuthModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
