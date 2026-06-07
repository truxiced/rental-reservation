import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown properties from request bodies
      forbidNonWhitelisted: true,   // throw 400 if unknown properties are sent
      transform: true,              // auto-transform payloads to DTO class instances
      transformOptions: { enableImplicitConversion: true }, // coerce query-string primitives (e.g. "1" → 1)
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(3000);
  console.log("Reservation BFF running on http://localhost:3000/api");
};

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
