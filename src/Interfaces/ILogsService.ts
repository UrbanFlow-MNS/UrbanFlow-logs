import { LogsDto } from '../Objects/DTOs/logs.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface ILogsService {

  getAllLogs(): Promise<LogsDto[]>;

  getLogsWithParameters(
    numberOfElement?: number,
    startingElement?: number,
    codeOfEvent?: string,
    microserviceName?: string,
    startDate?: string,
    endDate?: string
  ): Promise<LogsDto[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;

  updateLogs(id: number, log: LogsDto): Promise<UpdateResult>;

  getWithId(id: number): Promise<LogsDto>;

  deleteLogs(id: number): Promise<DeleteResult>;
}