import { Controller, Get } from '@nestjs/common';
import { LogsService } from '../Services/logs.service';
import { LogsEntity } from '../Objects/Entities/logs.entity';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get()
  async findAll(): Promise<LogsEntity[]> {
    return await this.logsService.getAllLogs();
  }
}