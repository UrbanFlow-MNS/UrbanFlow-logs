import { Module } from '@nestjs/common';
import { LogsController } from './Controllers/logs.controller';
import { LogsService } from './Services/logs.service';

@Module({
  imports: [],
  controllers: [LogsController],
  providers: [LogsService],
})
export class AppModule {}
