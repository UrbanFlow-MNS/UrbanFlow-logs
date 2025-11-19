import { Controller, Get } from '@nestjs/common';

@Controller('logs')
export class CatsController {
  // TODO : Remove the placeholder
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}