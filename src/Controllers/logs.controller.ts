import { Body, Controller, Get, Post } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import type { ILogsService } from '../Interfaces/ILogsService';

@Controller('logs')
export class LogsController {
  constructor(private logsService: ILogsService) {}

  @Get()
  async findAll(): Promise<LogsEntity[]> {
    return await this.logsService.getAllLogs();
  }

  @Post()
  async create(@Body() log: LogsDto): Promise<LogsDto> {
    return await this.logsService.createLogs(log);
  }
}