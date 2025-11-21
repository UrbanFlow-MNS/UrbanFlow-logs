
export class LogsDto {
  microserviceName: string;
  codeOfEvent: string;
  event: string;

  constructor(microserviceName: string, codeOfEvent: string, event: string) {
    this.microserviceName = microserviceName;
    this.codeOfEvent = codeOfEvent;
    this.event = event;
  }
}