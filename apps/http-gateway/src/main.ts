require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const uri = process.env.BASE_URI;
const port = process.env.API_GATEWAY_PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // config swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API Docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);

  // start app
  await app.listen(port, () =>
    console.log(`Start http-gateway at ${uri}:${port}`),
  );
}
bootstrap();
