import { ApiProperty } from '@nestjs/swagger';

export class LogsDto {
  @ApiProperty()
  microserviceName: string;

  @ApiProperty()
  codeOfEvent: string;

  @ApiProperty()
  event: string;

  @ApiProperty()
  createdAt: Date;

  constructor(microserviceName: string, codeOfEvent: string, event: string, createdAt: Date) {
    this.microserviceName = microserviceName;
    this.codeOfEvent = codeOfEvent;
    this.event = event;
    this.createdAt = createdAt;
  }
}