import { Body, Controller, Get, Post } from '@nestjs/common';
import { LogsService } from '../Services/logs.service';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { LogsDto } from '../Objects/DTOs/logs.dto';

@Controller('logs')
export class LogsController {
  constructor(private logsService: LogsService) {}

  @Get()
  async findAll(): Promise<LogsEntity[]> {
    return await this.logsService.getAllLogs();
  }

  @Post()
  async create(@Body() log: LogsDto): Promise<LogsDto> {
    return await this.logsService.createLogs(log);
  }

}