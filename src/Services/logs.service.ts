import { Injectable } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { ILogsService } from '../Interfaces/ILogsService';

@Injectable()
export class LogsService implements ILogsService {
  constructor(
    @InjectRepository(LogsEntity)
    public logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogsEntity[]> {
    return await this.logsRepository.find();
  }

  async createLogs(logsDto: LogsDto): Promise<LogsDto> {
    const log = this.logsRepository.create(logsDto);
    return await this.logsRepository.save(log);
  }
}
