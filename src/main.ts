import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"
// import properties from './config/properties';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  app.enableCors({
    origin: `http://${process.env.FRONTEND_APP_DOMAIN}:${process.env.FRONTEND_APP_PORT}`,
    credentials: true //in order for the frontend to get the cookie value
  })
  app.setGlobalPrefix('api')

  await app.listen(8181);
}
bootstrap();
