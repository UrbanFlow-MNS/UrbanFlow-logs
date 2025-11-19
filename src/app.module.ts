import { Module } from '@nestjs/common';
import { LogsController } from './Controllers/logs.controller';
import { LogsService } from './Services/logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsEntity } from './Objects/Entities/logs.entity';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [LogsEntity],
      synchronize: true, // TODO: à désactiver en production
    }),
    TypeOrmModule.forFeature([LogsEntity]),
  ],
    controllers: [LogsController],
  providers: [LogsService],
})
export class AppModule {}
