import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { LogsController } from './../src/Controllers/logs.controller';
import { PrometheusController } from './../src/Controllers/prometheus.controller';
import { LogsService } from './../src/Services/logs.service';
import { PrometheusService } from './../src/Services/prometheus.service';
import { LogsEntity } from './../src/Objects/Entities/logs.entity';

const buildLog = (overrides: Partial<LogsEntity> = {}): LogsEntity => ({
  id: 1,
  microserviceName: 'auth',
  codeOfEvent: '200',
  event: 'login',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
});

describe('Logs API (e2e)', () => {
  let app: INestApplication<App>;
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [LogsController, PrometheusController],
      providers: [
        LogsService,
        { provide: 'ILogsService', useClass: LogsService },
        PrometheusService,
        { provide: 'IPrometheusService', useClass: PrometheusService },
        { provide: getRepositoryToken(LogsEntity), useValue: repository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /metrics exposes prometheus metrics', async () => {
    const response = await request(app.getHttpServer()).get('/metrics');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/plain');
    expect(response.text).toContain('process_cpu_user_seconds_total');
  });

  it('GET /logs/:id returns a single log', async () => {
    repository.findOne.mockResolvedValue(buildLog());

    const response = await request(app.getHttpServer()).get('/logs/1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: 1, microserviceName: 'auth' });
  });

  it('GET /logs/:id returns 404 when the log is missing', async () => {
    repository.findOne.mockResolvedValue(null);

    const response = await request(app.getHttpServer()).get('/logs/999');

    expect(response.status).toBe(404);
  });

  it('POST /logs creates a log', async () => {
    const created = buildLog();
    repository.create.mockReturnValue(created);
    repository.save.mockResolvedValue(created);

    const response = await request(app.getHttpServer())
      .post('/logs')
      .send({ microserviceName: 'auth', codeOfEvent: '200', event: 'login' });

    expect(response.status).toBe(201);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({ id: 1 });
  });

  it('PUT /logs/:id updates a log', async () => {
    repository.update.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

    const response = await request(app.getHttpServer())
      .put('/logs/1')
      .send({ microserviceName: 'auth', codeOfEvent: '500', event: 'error' });

    expect(response.status).toBe(200);
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('DELETE /logs/:id removes a log', async () => {
    repository.delete.mockResolvedValue({ affected: 1, raw: [] });

    const response = await request(app.getHttpServer()).delete('/logs/1');

    expect(response.status).toBe(200);
    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
