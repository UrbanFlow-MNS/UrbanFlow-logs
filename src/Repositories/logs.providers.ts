
import { DataSource } from 'typeorm';
import { logs } from '../Objects/Entities/logs.entity'
export const logsProviders = [
  {
    provide: 'LOGS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(logs),
    inject: ['DATA_SOURCE'],
  },
];
