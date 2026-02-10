import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import cookieParser from "cookie-parser"
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  SwaggerConfigInit(app)
  app.useStaticAssets("public")
  app.use(cookieParser(process.env.COOKIE_SECRET||"secret"))
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000,()=>{
    console.log("http://localhost:3000 \nhttp://localhost:3000/swagger")
  });
}
bootstrap();
