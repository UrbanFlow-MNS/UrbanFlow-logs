import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { LogBody } from '@bato-urbanflow/urbanflow-models';
import { LogsController } from './logs.controller';

const buildLog = (): LogBody =>
  ({
    microserviceName: 'auth',
    codeOfEvent: '200',
    event: 'login',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  }) as LogBody;

describe('LogsController', () => {
  let controller: LogsController;
  let service: {
    getAllLogs: Mock;
    getLogsWithParameters: Mock;
    getWithId: Mock;
    createLogs: Mock;
    updateLogs: Mock;
    deleteLogs: Mock;
  };

  beforeEach(async () => {
    service = {
      getAllLogs: vi.fn(),
      getLogsWithParameters: vi.fn(),
      getWithId: vi.fn(),
      createLogs: vi.fn(),
      updateLogs: vi.fn(),
      deleteLogs: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [{ provide: 'ILogsService', useValue: service }],
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll delegates to the service', async () => {
    const logs = [buildLog()];
    service.getAllLogs.mockResolvedValue(logs);

    await expect(controller.findAll()).resolves.toEqual(logs);
    expect(service.getAllLogs).toHaveBeenCalledTimes(1);
  });

  it('findWithFilters forwards each payload field in order', async () => {
    const logs = [buildLog()];
    service.getLogsWithParameters.mockResolvedValue(logs);

    const payload = {
      numberOfElement: 10,
      startingElement: 0,
      codeOfEvent: '500',
      microserviceName: 'auth',
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    };

    await expect(controller.findWithFilters(payload)).resolves.toEqual(logs);
    expect(service.getLogsWithParameters).toHaveBeenCalledWith(
      10,
      0,
      '500',
      'auth',
      '2026-01-01',
      '2026-02-01',
    );
  });

  it('getWithId delegates to the service', async () => {
    const log = buildLog();
    service.getWithId.mockResolvedValue(log);

    await expect(controller.getWithId(3)).resolves.toEqual(log);
    expect(service.getWithId).toHaveBeenCalledWith(3);
  });

  it('create delegates to the service', async () => {
    const log = buildLog();
    service.createLogs.mockResolvedValue(log);

    await expect(controller.create(log)).resolves.toEqual(log);
    expect(service.createLogs).toHaveBeenCalledWith(log);
  });

  it('update delegates to the service', async () => {
    const log = buildLog();
    const updateResult = { affected: 1 };
    service.updateLogs.mockResolvedValue(updateResult);

    await expect(controller.update(7, log)).resolves.toEqual(updateResult);
    expect(service.updateLogs).toHaveBeenCalledWith(7, log);
  });

  it('delete delegates to the service', async () => {
    const deleteResult = { affected: 1 };
    service.deleteLogs.mockResolvedValue(deleteResult);

    await expect(controller.delete(7)).resolves.toEqual(deleteResult);
    expect(service.deleteLogs).toHaveBeenCalledWith(7);
  });

  it('handleEventCreated creates a log from the message payload', async () => {
    const log = buildLog();
    service.createLogs.mockResolvedValue(log);

    await expect(controller.handleEventCreated(log)).resolves.toEqual(log);
    expect(service.createLogs).toHaveBeenCalledWith(log);
  });
});
