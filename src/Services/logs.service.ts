import { Injectable } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { ILogsService } from '../Interfaces/ILogsService';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

@Injectable()
export class LogsService implements ILogsService {
  constructor(
    @InjectRepository(LogsEntity)
    public logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogsEntity[]> {
    return await this.logsRepository.find();
  }

  async getLogsWithParameters(logsFilterModel: LogsFilterModel) : Promise<LogsEntity[]> {
    const fetchedLogs = await this.logsRepository.find({
      where: {
        ...(logsFilterModel.errorCode && { codeOfEvent: logsFilterModel.errorCode }), // "Spread operators", gestion des undefined
        ...(logsFilterModel.microserviceName && { microserviceName: logsFilterModel.microserviceName }),
      },
    });

    return fetchedLogs.slice(0, logsFilterModel.numberOfElement)
  }

  async createLogs(logsDto: LogsDto): Promise<LogsDto> {
    const log = this.logsRepository.create(logsDto);
    return await this.logsRepository.save(log);
  }
}
