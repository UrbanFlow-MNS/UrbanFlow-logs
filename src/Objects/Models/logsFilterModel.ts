export class LogsFilterModel {
  numberOfElement?: number
  startingElement?: number
  codeOfEvent?: string
  microserviceName?: string
  startDate?: Date
  endDate?: Date

  constructor(numberOfElement: number | undefined,
              startingElement: number | undefined,
              codeOfEvent: string | undefined,
              microserviceName: string | undefined,
              startDate : Date |undefined,
              endDate : Date | undefined) {
    this.numberOfElement = numberOfElement;
    this.startingElement = startingElement;
    this.codeOfEvent = codeOfEvent;
    this.microserviceName = microserviceName;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}