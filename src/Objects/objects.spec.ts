import { MoreThanOrEqual } from 'typeorm';
import { LogsDto } from './DTOs/logs.dto';
import { WhereFilterDto } from './DTOs/whereFilter.dto';
import { DeleteResultDto } from './DTOs/deleteResult.dto';
import { UpdateResultDto } from './DTOs/updateResult.dto';
import { LogsFilterModel } from './Models/logsFilterModel';
import { LogsEntity } from './Entities/logs.entity';

describe('Objects', () => {
  it('LogsDto assigns every field from the constructor', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const dto = new LogsDto('auth', '200', 'login', createdAt);

    expect(dto).toMatchObject({
      microserviceName: 'auth',
      codeOfEvent: '200',
      event: 'login',
      createdAt,
    });
  });

  it('WhereFilterDto keeps the provided date operator', () => {
    const operator = MoreThanOrEqual(new Date('2026-01-01'));
    const dto = new WhereFilterDto('auth', '200', operator);

    expect(dto.microserviceName).toBe('auth');
    expect(dto.codeOfEvent).toBe('200');
    expect(dto.createdAt).toBe(operator);
  });

  it('DeleteResultDto assigns its fields', () => {
    const dto = new DeleteResultDto(true, 3);

    expect(dto.acknowledged).toBe(true);
    expect(dto.deletedCount).toBe(3);
  });

  it('UpdateResultDto assigns its fields', () => {
    const dto = new UpdateResultDto(true, 2, 1, 0, 42);

    expect(dto).toMatchObject({
      acknowledged: true,
      matchedCount: 2,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: 42,
    });
  });

  it('LogsFilterModel assigns every filter field', () => {
    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-02-01');
    const model = new LogsFilterModel(10, 0, '200', 'auth', startDate, endDate);

    expect(model).toMatchObject({
      numberOfElement: 10,
      startingElement: 0,
      codeOfEvent: '200',
      microserviceName: 'auth',
      startDate,
      endDate,
    });
  });

  it('LogsEntity can be instantiated and populated', () => {
    const entity = new LogsEntity();
    entity.id = 1;
    entity.microserviceName = 'auth';
    entity.codeOfEvent = '200';
    entity.event = 'login';
    entity.createdAt = new Date('2026-01-01T00:00:00.000Z');

    expect(entity.id).toBe(1);
    expect(entity.microserviceName).toBe('auth');
  });
});
