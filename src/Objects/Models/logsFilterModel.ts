export class LogsFilterModel {
  numberOfElement: number | undefined
  errorCode : string | undefined
  microserviceName : string | undefined

  constructor(numberOfElement: number | undefined, errorCode: string | undefined, microserviceName: string | undefined) {
    this.numberOfElement = numberOfElement;
    this.errorCode = errorCode;
    this.microserviceName = microserviceName;
  }
}