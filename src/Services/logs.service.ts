import { Injectable, NotFoundException } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DeleteResult, FindOperator, LessThanOrEqual, MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { ILogsService } from '../Objects/Interfaces/ILogsService';

@Injectable()
export class LogsService implements ILogsService {
  constructor(
    @InjectRepository(LogsEntity)
    public logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogsDto[]> {
    return await this.logsRepository.find();
  }
  async getWithId(id: number): Promise<LogsDto> {
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
  ) : Promise<LogsDto[]> {

    let parsedStartDate : Date | undefined
    let parsedEndDate : Date | undefined
    if(startDate !== undefined){
      parsedStartDate = new Date(Date.parse(startDate))
    }
    if(endDate !== undefined){
      parsedEndDate = new Date(Date.parse(endDate))
    }

    const fetchedLogs : LogsDto[] = await this.logsRepository.find({
      where : {
        microserviceName: microserviceName,
        codeOfEvent: codeOfEvent,
        createdAt: this.getDateFindOperator(parsedStartDate, parsedEndDate)
      }
    });
    if(startingElement === undefined) {
      startingElement = 0
    } else if (startingElement >= fetchedLogs.length) {
      throw new Error("The starting element is greater than the number of element")
    }

    if(numberOfElement === undefined){
      numberOfElement = 50 // valeur max dans tout les cas pour éviter un call trop important
    }

    return fetchedLogs.slice(startingElement, numberOfElement)
  }

  async createLogs(logsDto: LogsDto): Promise<LogsDto> {
    const log = this.logsRepository.create(logsDto);
    return await this.logsRepository.save(log);
  }

  async updateLogs(id: number, log: LogsDto): Promise<UpdateResult> {
    return await this.logsRepository.update(id, log);
  }

  async deleteLogs(id:number): Promise<DeleteResult> {
    return await this.logsRepository.delete(id)
  }

  // Utils
  getDateFindOperator(startDate?: Date, endDate?: Date): FindOperator<Date> | undefined {
    if(startDate == undefined && endDate == undefined)
      return undefined

    if (startDate != undefined && endDate != undefined)
      return Between(startDate, endDate)

    if(endDate != undefined)
      return LessThanOrEqual(endDate)

    if(startDate != undefined)
      return MoreThanOrEqual(startDate)
  }

}
