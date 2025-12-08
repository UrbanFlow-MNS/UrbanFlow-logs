import { LogsDto } from '../Objects/DTOs/logs.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface ILogsService {

  getAllLogs(): Promise<LogsDto[]>;

  getLogsWithParameters(
    numberOfElement: number | undefined,
    startingElement: number | undefined,
    codeOfEvent : string | undefined,
    microserviceName : string | undefined,
    startDate : Date | undefined,
    endDate : Date | undefined
  ): Promise<LogsDto[]>;

  createLogs(logsDto: LogsDto): Promise<LogsDto>;

  updateLogs(id: number, log: LogsDto): Promise<UpdateResult>;

  getWithId(id: number): Promise<LogsDto>;

  deleteLogs(id: number): Promise<DeleteResult>;
}