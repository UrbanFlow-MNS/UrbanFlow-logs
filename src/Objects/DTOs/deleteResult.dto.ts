import { ApiProperty } from '@nestjs/swagger';

export class DeleteResultDto {

  @ApiProperty()
  acknowledged: boolean;
  @ApiProperty()
  deletedCount: number;

  constructor(acknowledged: boolean, deletedCount: number) {
    this.acknowledged = acknowledged;
    this.deletedCount = deletedCount;
  }

}
