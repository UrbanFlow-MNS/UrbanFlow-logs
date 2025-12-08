import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsController } from './Controllers/logs.controller';
import { LogsEntity } from './Objects/Entities/logs.entity';
import { LogsService } from './Services/logs.service';

@Module({
    imports: [
        ConfigModule.forRoot(
            {
                isGlobal: true,
            }
        ),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [LogsEntity],
            synchronize: Boolean(process.env.POSTGRES_SYNCHRONISE)
        }),
        TypeOrmModule.forFeature([LogsEntity])
    ],
    controllers: [LogsController],
    providers: [
        LogsService,
        {
            provide: 'ILogsService',
            useClass: LogsService,
        }],
})
export class AppModule { }
