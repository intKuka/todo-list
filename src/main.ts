import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('To-Do REST API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port, () => {
    console.log(`Server is running at ${port} in ${process.env.NODE_ENV} mode`);
  });
}
bootstrap();
