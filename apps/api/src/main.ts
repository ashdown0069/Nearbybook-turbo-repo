import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import helmet from "helmet"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const config = new DocumentBuilder()
    .setTitle("NearbyBook API")
    .setDescription("The NearbyBook API description")
    .setVersion("1.0")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api-docs", app, document)

  console.log("port connected", process.env.PORT)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
