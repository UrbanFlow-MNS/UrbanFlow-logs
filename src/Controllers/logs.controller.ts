import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';
import { ILogsService } from '../Interfaces/ILogsService';


@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: ILogsService) {}

  @Get()
  async findAll(): Promise<LogsEntity[]> {
    return await this.logsService.getAllLogs();
  }

  @Get()
  async findWithFilters(@Query(new ValidationPipe({ transform: true})) logsFilter: LogsFilterModel ): Promise<LogsEntity[]> {
    return await this.logsService.getLogsWithParameters(logsFilter);
  }

  @Post()
  async create(@Body() log: LogsDto): Promise<LogsDto> {
    return await this.logsService.createLogs(log);
  }
}