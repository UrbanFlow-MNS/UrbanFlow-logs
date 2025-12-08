import {
    Body,
    Controller, Delete,
    Get,
    Inject, Param,
    Post, Put,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
    ApiBody,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiParam,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import * as ILogsService from '../Interfaces/ILogsService';
import { DeleteResultDto } from '../Objects/DTOs/deleteResult.dto';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { UpdateResultDto } from '../Objects/DTOs/updateResult.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

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

  @ApiParam({
    name: 'numberOfElement',
    description: 'Number of Element you want to fetch',
    type: 'number',
    required: false,
  })
  @ApiParam({
    name: 'startingElement',
    description: 'The index of the first element you want to fetch',
    type: 'number',
    required: false,
  })
  @ApiParam({
    name: 'codeOfEvent',
    description: 'The HTTP code you are searching for',
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'microserviceName',
    description: 'The name of the microservice you are looking for',
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'startDate',
    description: 'The starting date of the range of logs you want to fetch',
    type: 'timestamp',
    required: false,
  })
  @ApiParam({
    name: 'endDate',
    description: 'The ending date of the range of logs you want to fetch',
    type: 'timestamp',
    required: false,
  })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Search successful',
    type: LogsDto,
  })
  @Get()
  async findWithFilters(
    @Query(new ValidationPipe({ transform: true })) logsFilter: LogsFilterModel,
  ): Promise<LogsDto[]> {
    return await this.logsService.getLogsWithParameters(logsFilter);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Search successful',
    type: LogsDto,
  })
  @Get('/:id')
  async getWithId(@Param('id') id: number): Promise<LogsDto> {
    return await this.logsService.getWithId(id);
  }

  @ApiBody({ type: LogsDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Creation successful',
    type: LogsDto,
  })
  @Post()
  async create(@Body() log: LogsDto): Promise<LogsDto> {
    return await this.logsService.createLogs(log);
  }

  @ApiBody({ type: LogsDto })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Update successful',
    type: UpdateResultDto,
  })
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() log: LogsDto,
  ): Promise<UpdateResult> {
    return await this.logsService.updateLogs(id, log);
  }
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Delete successful',
    type: DeleteResultDto,
  })
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.logsService.deleteLogs(id);
  }

  @EventPattern('logs_created')
  async handleEventCreated(@Payload() data: LogsDto) {
    await this.logsService.createLogs(data);
  }

}