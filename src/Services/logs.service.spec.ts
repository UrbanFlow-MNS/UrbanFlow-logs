import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LogBody } from '@bato-urbanflow/urbanflow-models';
import { LogsService } from './logs.service';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildLog = (overrides: Partial<LogsEntity> = {}): LogsEntity => ({
  id: 1,
  microserviceName: 'auth',
  codeOfEvent: '200',
  event: 'login',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

describe('LogsService', () => {
  let service: LogsService;
  let repository: MockRepository<LogsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(LogsEntity),
          useValue: createMockRepository<LogsEntity>(),
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    repository = module.get(getRepositoryToken(LogsEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLogs', () => {
    it('returns every log from the repository', async () => {
      const logs = [buildLog(), buildLog({ id: 2 })];
      repository.find!.mockResolvedValue(logs);

      await expect(service.getAllLogs()).resolves.toEqual(logs);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWithId', () => {
    it('returns the matching log', async () => {
      const log = buildLog();
      repository.findOne!.mockResolvedValue(log);

      await expect(service.getWithId(1)).resolves.toEqual(log);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('throws NotFoundException when no log matches', async () => {
      repository.findOne!.mockResolvedValue(null);

      await expect(service.getWithId(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getLogsWithParameters', () => {
    it('applies default paging when parameters are omitted', async () => {
      const logs = [buildLog(), buildLog({ id: 2 }), buildLog({ id: 3 })];
      repository.find!.mockResolvedValue(logs);

      const result = await service.getLogsWithParameters();

      expect(result).toEqual(logs);
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          microserviceName: undefined,
          codeOfEvent: undefined,
          createdAt: undefined,
        },
        skip: 0,
        take: 50,
      });
    });

    it('forwards filters and builds a date range operator', async () => {
      repository.find!.mockResolvedValue([buildLog()]);

      await service.getLogsWithParameters(
        10,
        0,
        '500',
        'auth',
        '2026-01-01',
        '2026-02-01',
      );

      const call = repository.find!.mock.calls[0][0];
      expect(call.where.microserviceName).toBe('auth');
      expect(call.where.codeOfEvent).toBe('500');
      expect(call.where.createdAt).toBeDefined();
    });

    it('ignores the literal string "undefined" and empty dates', async () => {
      repository.find!.mockResolvedValue([]);

      await service.getLogsWithParameters(
        undefined,
        undefined,
        undefined,
        undefined,
        'undefined',
        '',
      );

      expect(repository.find!.mock.calls[0][0].where.createdAt).toBeUndefined();
    });

    it('ignores unparseable dates', async () => {
      repository.find!.mockResolvedValue([]);

      await service.getLogsWithParameters(
        undefined,
        undefined,
        undefined,
        undefined,
        'not-a-date',
        'still-not-a-date',
      );

      expect(repository.find!.mock.calls[0][0].where.createdAt).toBeUndefined();
    });

    it('paginates via skip and take at the database level', async () => {
      const logs = [buildLog(), buildLog({ id: 2 })];
      repository.find!.mockResolvedValue(logs);

      const result = await service.getLogsWithParameters(3, 1);

      expect(result).toBe(logs);
      expect(repository.find!.mock.calls[0][0]).toMatchObject({
        skip: 1,
        take: 3,
      });
    });

    it('caps take at 100 to prevent unbounded queries', async () => {
      repository.find!.mockResolvedValue([]);

      await service.getLogsWithParameters(500, 0);

      expect(repository.find!.mock.calls[0][0]).toMatchObject({
        skip: 0,
        take: 100,
      });
    });
  });

  describe('createLogs', () => {
    it('creates and persists a log', async () => {
      const dto = { microserviceName: 'auth', codeOfEvent: '200', event: 'x' } as LogBody;
      const entity = buildLog();
      repository.create!.mockReturnValue(entity);
      repository.save!.mockResolvedValue(entity);

      await expect(service.createLogs(dto)).resolves.toEqual(entity);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('updateLogs', () => {
    it('delegates the update to the repository', async () => {
      const updateResult = { affected: 1, raw: [], generatedMaps: [] };
      repository.update!.mockResolvedValue(updateResult);
      const dto = { microserviceName: 'auth', codeOfEvent: '200', event: 'x' } as LogBody;

      await expect(service.updateLogs(1, dto)).resolves.toEqual(updateResult);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('deleteLogs', () => {
    it('delegates the delete to the repository', async () => {
      const deleteResult = { affected: 1, raw: [] };
      repository.delete!.mockResolvedValue(deleteResult);

      await expect(service.deleteLogs(1)).resolves.toEqual(deleteResult);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
