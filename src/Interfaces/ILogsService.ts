import { LogsEntity } from '../Objects/Entities/logs.entity';
import { Repository } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';

export interface ILogsService {
  logsRepository: Repository<LogsEntity>;

  getAllLogs(): Promise<LogsEntity[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;
}