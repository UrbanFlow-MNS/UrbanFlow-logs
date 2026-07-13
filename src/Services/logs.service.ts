import { Injectable, NotFoundException } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { LogBody } from '@bato-urbanflow/urbanflow-models';
import { ILogsService } from '../Objects/Interfaces/ILogsService';
import { dateUtils } from '@bato-urbanflow/urbanflow-models'

@Injectable()
export class LogsService implements ILogsService {
  constructor(
    @InjectRepository(LogsEntity)
    public logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogBody[]> {
    return await this.logsRepository.find();
  }
  async getWithId(id: number): Promise<LogBody> {
    const fetchedLog : LogsEntity | null = await this.logsRepository.findOne({
      where : { id : id }
    })

    if(fetchedLog === null){
      throw new NotFoundException('No logs found')
    }
    return fetchedLog
  }


  async getLogsWithParameters(
    numberOfElement?: number,
    startingElement?: number,
    codeOfEvent? : string,
    microserviceName? : string,
    startDate? : string,
    endDate? : string
  ) : Promise<LogBody[]> {

    let parsedStartDate : Date | undefined
    let parsedEndDate : Date | undefined
    if (startDate !== undefined && startDate !== 'undefined' && startDate !== '') {
      const parsed = new Date(Date.parse(startDate));
      if (!isNaN(parsed.getTime())) {
        parsedStartDate = parsed;
      }
    }
    if (endDate !== undefined && endDate !== 'undefined' && endDate !== '') {
      const parsed = new Date(Date.parse(endDate));
      if (!isNaN(parsed.getTime())) {
        parsedEndDate = parsed;
      }
    }

    return await this.logsRepository.find({
      where : {
        microserviceName: microserviceName,
        codeOfEvent: codeOfEvent,
        createdAt: dateUtils.getDateFindOperator(parsedStartDate, parsedEndDate)
      },
      skip: startingElement ?? 0,
      take: Math.min(numberOfElement ?? 50, 100),
    });
  }

  async createLogs(logsDto: LogBody): Promise<LogBody> {
    const log = this.logsRepository.create(logsDto);
    return await this.logsRepository.save(log);
  }

  async updateLogs(id: number, log: LogBody): Promise<UpdateResult> {
    return await this.logsRepository.update(id, log);
  }

  async deleteLogs(id:number): Promise<DeleteResult> {
    return await this.logsRepository.delete(id)
  }


}
