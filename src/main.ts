import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors()
  if (process.env.DEV) {
    const config = new DocumentBuilder()
      .setTitle('Study api')
      .build();
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
  }
  await app.listen(process.env.PORT ?? 8080);
}
await bootstrap();
