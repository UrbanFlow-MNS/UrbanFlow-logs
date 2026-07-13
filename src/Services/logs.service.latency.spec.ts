import { performance } from 'perf_hooks';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogsService } from './logs.service';
import { LogsEntity } from '../Objects/Entities/logs.entity';
import {
  createMockRepository,
  MockRepository,
} from '../Testing/mockRepository';

const buildDataset = (size: number): LogsEntity[] =>
  Array.from({ length: size }, (_, index) => ({
    id: index + 1,
    microserviceName: 'auth',
    codeOfEvent: '200',
    event: 'login',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  }));

const measure = async (action: () => Promise<unknown>): Promise<number> => {
  const start = performance.now();
  await action();
  return performance.now() - start;
};

describe('LogsService latency', () => {
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

  it('getAllLogs resolves a large dataset under 100ms', async () => {
    repository.find!.mockResolvedValue(buildDataset(10000));

    const elapsed = await measure(() => service.getAllLogs());

    expect(elapsed).toBeLessThan(100);
  });

  it('getLogsWithParameters filters and slices under 150ms', async () => {
    repository.find!.mockResolvedValue(buildDataset(10000));

    const elapsed = await measure(() =>
      service.getLogsWithParameters(50, 0, '200', 'auth', '2026-01-01', '2026-02-01'),
    );

    expect(elapsed).toBeLessThan(150);
  });

  it('keeps a stable average latency across repeated calls', async () => {
    repository.find!.mockResolvedValue(buildDataset(1000));

    const iterations = 50;
    let total = 0;
    for (let index = 0; index < iterations; index += 1) {
      total += await measure(() => service.getLogsWithParameters(50, 0));
    }

    expect(total / iterations).toBeLessThan(20);
  });
});
