import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });
  // app.useGlobalPipes

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`UzSavdo API is running on http://localhost:${port}/api/v1`);
}
bootstrap();
