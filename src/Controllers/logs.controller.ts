import {
    Body,
    Controller, Delete,
    Get,
    Inject, Param,
    Post, Put,
    Query,
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
import * as ILogsService from '../Objects/Interfaces/ILogsService';
import { DeleteResultDto } from '../Objects/DTOs/deleteResult.dto';
import { UpdateResultDto } from '../Objects/DTOs/updateResult.dto';
import { LogEventType, LogBody } from '@bato-urbanflow/urbanflow-models';

@Controller('logs')
export class LogsController {
  constructor(
    @Inject('ILogsService')
    private readonly logsService: ILogsService.ILogsService,
  ) {
    this.logsService = logsService;
  }

  //@Get()
  async findAll(): Promise<LogBody[]> {
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
    type: 'string',
    required: false,
  })
  @ApiParam({
    name: 'endDate',
    description: 'The ending date of the range of logs you want to fetch',
    type: 'string',
    required: false,
  })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Search successful',
    type: LogBody,
  })
  @Get()
  async findWithFilters(
    @Query('numberOfElement') numberOfElement?: number,
    @Query('startingElement') startingElement?: number,
    @Query('codeOfEvent') codeOfEvent? : string ,
    @Query('microserviceName') microserviceName? : string ,
    @Query('startDate') startDate? : string,
    @Query('endDate') endDate? : string
  ): Promise<LogBody[]> {
    return await this.logsService.getLogsWithParameters(numberOfElement,startingElement,codeOfEvent,microserviceName,startDate,endDate);
  }

  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiNotFoundResponse({ description: 'Log not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Search successful',
    type: LogBody,
  })
  @Get('/:id')
  async getWithId(@Param('id') id: number): Promise<LogBody> {
    return await this.logsService.getWithId(id);
  }

  @ApiBody({ type: LogBody })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiCreatedResponse({
    description: 'Creation successful',
    type: LogBody,
  })
  @Post()
  async create(@Body() log: LogBody): Promise<LogBody> {
    return await this.logsService.createLogs(log);
  }

  @ApiBody({ type: LogBody })
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
    @Body() log: LogBody,
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

  @EventPattern(LogEventType.LOGS_CREATE)
  async handleEventCreated(@Payload() data: LogBody) {
    await this.logsService.createLogs(data);
  }

}