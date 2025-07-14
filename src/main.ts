import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiKeyMiddleware } from './auth/strategy/middleware/swaggerMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS FIRST - before any other middleware
  app.enableCors({
    origin: [
      'http://localhost:3000', // React default port
      'http://localhost:5173', // Vite default port
      'http://localhost:4173', // Vite preview port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173',
      // Add your production domains here
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-api-key', // Explicitly allow your custom header
    ],
    credentials: true,
  });

  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Apply API key middleware
  app.use(new ApiKeyMiddleware().use);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Network-backend API')
    .setDescription('The Network API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'x-api-key',
    )
    .addSecurityRequirements('access-token')
    .addSecurityRequirements('x-api-key')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use port 4040 to match your frontend configuration
  const port = process.env.PORT || 4040;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}

bootstrap();  