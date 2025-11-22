export class LogsFilterModel {
  numberOfElement: number | undefined
  codeOfEvent : string | undefined
  microserviceName : string | undefined

  constructor(numberOfElement: number | undefined, codeOfEvent: string | undefined, microserviceName: string | undefined) {
    this.numberOfElement = numberOfElement;
    this.codeOfEvent = codeOfEvent;
    this.microserviceName = microserviceName;
  }
}