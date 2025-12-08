import {
  Body,
  Controller, Delete,
  Get,
  Inject, Param,
  Post, Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';
import * as ILogsService from '../Interfaces/ILogsService';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('logs')
export class LogsController {
  constructor(
    @Inject('ILogsService')
    private readonly logsService: ILogsService.ILogsService,
  ) {
    this.logsService = logsService;
  }

  //@Get()
  async findAll(): Promise<LogsDto[]> {
    return await this.logsService.getAllLogs();
  }

  @Get()
  async findWithFilters(
    @Query(new ValidationPipe({ transform: true })) logsFilter: LogsFilterModel,
  ): Promise<LogsDto[]> {
    return await this.logsService.getLogsWithParameters(logsFilter);
  }

  @Get("/:id")
  async getWithId(@Param('id') id: number,): Promise<LogsDto> {
    return await this.logsService.getWithId(id);
  }
  @Post()
  async create(@Body() log: LogsDto): Promise<LogsDto> {
    return await this.logsService.createLogs(log);
  }

  @Put("/:id")
  async update(@Param('id') id: number,@Body() log: LogsDto): Promise<UpdateResult> {
    return await this.logsService.updateLogs(id, log);
  }

  @Delete("/:id")
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.logsService.deleteLogs(id);
  }
}