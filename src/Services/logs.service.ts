import { Injectable, NotFoundException } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { ILogsService } from '../Interfaces/ILogsService';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

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

  async getLogsWithParameters(logsFilterModel: LogsFilterModel) : Promise<LogsDto[]> {
    const fetchedLogs : LogsDto[] = await this.logsRepository.find({
      where: {
        ...(logsFilterModel.codeOfEvent && { codeOfEvent: logsFilterModel.codeOfEvent }), // "Spread operators", gestion des undefined
        ...(logsFilterModel.microserviceName && { microserviceName: logsFilterModel.microserviceName }),
      },
    });
    if(logsFilterModel.startingElement === undefined) {
      logsFilterModel.startingElement = 0
    } else if (logsFilterModel.startingElement >= fetchedLogs.length) {
      throw new Error("The starting element is greater than the number of element")
    }

    if(logsFilterModel.numberOfElement === undefined){
      logsFilterModel.numberOfElement = 50 // valeur max dans tout les cas pour éviter un call trop important
    }

    return fetchedLogs.slice(logsFilterModel.startingElement, logsFilterModel.numberOfElement)
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

}
