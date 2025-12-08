import { ApiProperty } from '@nestjs/swagger';

export class UpdateResultDto {

  @ApiProperty()
  acknowledged: boolean;
  @ApiProperty()
  matchedCount: number;
  @ApiProperty()
  modifiedCount: number;
  @ApiProperty()
  upsertedCount: number;
  @ApiProperty()
  upsertedId: number

  constructor(acknowledged: boolean, matchedCount: number, modifiedCount: number, upsertedCount: number, upsertedId: number) {
    this.acknowledged = acknowledged;
    this.matchedCount = matchedCount;
    this.modifiedCount = modifiedCount;
    this.upsertedCount = upsertedCount;
    this.upsertedId = upsertedId;

  }

}
