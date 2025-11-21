import { LogsEntity } from '../Objects/Entities/logs.entity';
import { Repository } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

export interface ILogsService {
  logsRepository: Repository<LogsEntity>;

  getAllLogs(): Promise<LogsEntity[]>;

  getLogsWithParameters(logsFilterModel : LogsFilterModel): Promise<LogsEntity[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;
}