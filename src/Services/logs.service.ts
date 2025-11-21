import { Injectable } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogsEntity)
    private logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogsEntity[]> {
    return await this.logsRepository.find();
  }

}
