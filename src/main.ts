import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('API Logs BATO')
        .setDescription('API de gestion des logs du système BATO')
        .setVersion('1.0')
        .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [process.env.RABBIT_MQ ?? ''],
            queue: 'LOGS_QUEUE',
            queueOptions: {
                durable: false,
            },
        },
    });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.TCP_PORT) || 6002
    },
  });

    await app.startAllMicroservices()
    await app.listen(process.env.PORT ?? 4002);
}

bootstrap();