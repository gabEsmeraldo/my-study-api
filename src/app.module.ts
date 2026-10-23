import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module.js';
import { ProductModule } from './product/product.module.js';
import { FileModule } from './file/file.module.js';
import { UserModule } from './user/user.module.js';

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
