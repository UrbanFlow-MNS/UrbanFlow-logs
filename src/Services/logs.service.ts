import { Injectable } from '@nestjs/common';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsDto } from '../Objects/DTOs/logs.dto';
import { ILogsService } from '../Interfaces/ILogsService';
import { LogsFilterModel } from '../Objects/Models/logsFilterModel';

@Injectable()
export class LogsService implements ILogsService {
  constructor(
    @InjectRepository(LogsEntity)
    public logsRepository: Repository<LogsEntity>,
  ) {}

  async getAllLogs(): Promise<LogsEntity[]> {
    return await this.logsRepository.find();
  }

  async getLogsWithParameters(logsFilterModel: LogsFilterModel) : Promise<LogsEntity[]> {
    const fetchedLogs = await this.logsRepository.find({
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
}
