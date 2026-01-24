import { LogBody } from '@bato-urbanflow/urbanflow-models';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface ILogsService {

  getAllLogs(): Promise<LogBody[]>;

  getLogsWithParameters(
    numberOfElement?: number,
    startingElement?: number,
    codeOfEvent?: string,
    microserviceName?: string,
    startDate?: string,
    endDate?: string
  ): Promise<LogBody[]>;

  createLogs(logsDto: LogBody): Promise<LogBody>;

  updateLogs(id: number, log: LogBody): Promise<UpdateResult>;

  getWithId(id: number): Promise<LogBody>;

  deleteLogs(id: number): Promise<DeleteResult>;
}