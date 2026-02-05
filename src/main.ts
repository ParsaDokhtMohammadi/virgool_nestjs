import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import cookieParser from "cookie-parser"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  app.use(cookieParser(process.env.COOKIE_SECRET||"secret"))
  await app.listen(process.env.PORT ?? 3000,()=>{
    console.log("server running")
  });
}
bootstrap();
