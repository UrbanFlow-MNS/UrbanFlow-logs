import { Controller, Get } from '@nestjs/common';

@Controller('logs')
export class LogsController {
  // TODO : Remove the placeholder
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}