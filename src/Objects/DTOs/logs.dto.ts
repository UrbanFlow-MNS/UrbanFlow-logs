import { ApiProperty } from '@nestjs/swagger';

export class LogsDto {
  @ApiProperty()
  microserviceName: string;

  @ApiProperty()
  codeOfEvent: string;

  @ApiProperty()
  event: string;

  constructor(microserviceName: string, codeOfEvent: string, event: string) {
    this.microserviceName = microserviceName;
    this.codeOfEvent = codeOfEvent;
    this.event = event;
  }
}