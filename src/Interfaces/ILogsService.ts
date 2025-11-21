import { LogsEntity } from '../Objects/Entities/logs.entity';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

export const LogsServiceToken = Symbol('LogServiceToken');
export interface ILogsService {

  getAllLogs(): Promise<LogsEntity[]>;

  getLogsWithParameters(logsFilterModel : LogsFilterModel): Promise<LogsEntity[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;
}