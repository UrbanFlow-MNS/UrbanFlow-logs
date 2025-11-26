export class LogsFilterModel {
  numberOfElement: number | undefined
  startingElement: number | undefined
  codeOfEvent : string | undefined
  microserviceName : string | undefined

  constructor(numberOfElement: number | undefined,   startingElement: number | undefined, codeOfEvent: string | undefined, microserviceName: string | undefined) {
    this.numberOfElement = numberOfElement;
    this.startingElement = startingElement;
    this.codeOfEvent = codeOfEvent;
    this.microserviceName = microserviceName;
  }
}