import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import {
  SwaggerTheme,
  SwaggerThemeNameEnum,
} from 'swagger-themes';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('BK Company API')
    .setDescription('API para gestão de produtos, pedidos e dashboard')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();

  SwaggerModule.setup('docs', app, document, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DRACULA),
  });

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();