import { LogsDto } from '../Objects/DTOs/logs.dto';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';
import { UpdateResult } from 'typeorm';

export const LogsServiceToken = Symbol('LogServiceToken');
export interface ILogsService {

  getAllLogs(): Promise<LogsDto[]>;

  getLogsWithParameters(logsFilterModel : LogsFilterModel): Promise<LogsDto[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;

  updateLogs(id: number, log: LogsDto): Promise<UpdateResult>;

  getWithId(id: number): Promise<LogsDto>;
}