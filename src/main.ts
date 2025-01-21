import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enabling CORS
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://task-frontend-blush.vercel.app/login',
    ], // Allows all domains, you can restrict it to specific domains
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Log the MONGO_URI value to verify it's loaded correctly
  console.log('MONGO_URI:', configService.get('MONGO_URI'));

  await app.listen(3000);
}
bootstrap();
