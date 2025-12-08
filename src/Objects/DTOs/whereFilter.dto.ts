import { FindOperator } from 'typeorm';

export class WhereFilterDto {

  microserviceName: string | undefined;
  codeOfEvent: string | undefined;
  createdAt: FindOperator<Date> | undefined;


  constructor(microserviceName: string, codeOfEvent: string, createdAt: FindOperator<Date> | undefined) {
    this.microserviceName = microserviceName;
    this.codeOfEvent = codeOfEvent;
    this.createdAt = createdAt;
  }

}
