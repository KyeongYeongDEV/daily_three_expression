import { Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

function getSentinelConfig(configService: ConfigService): RedisOptions {
  const sentinelHosts = configService.get<string>('REDIS_SENTINEL_HOSTS');
  const masterName = configService.get<string>('REDIS_MASTER_NAME');

  if (!sentinelHosts || !masterName) {
    throw new Error(
      'REDIS_SENTINEL_HOSTS 또는 REDIS_MASTER_NAME이 .env 파일에 없습니다.',
    );
  }

  const sentinels = sentinelHosts.split(',').map((hostPort) => {
    const [host, port] = hostPort.split(':');
    if (!host || !port) {
      throw new Error(`잘못된 Sentinel 호스트 형식입니다: ${hostPort}`);
    }
    return { host: host, port: Number(port) };
  });

  return {
    sentinels,
    name: masterName,
  };
}

export const RedisWriteClientProvider: Provider = {
  provide: 'REDIS_WRITE',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const config = getSentinelConfig(configService);
    return new Redis(config);
  },
};

export const RedisReadClientProvider: Provider = {
  provide: 'REDIS_READ',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const config = getSentinelConfig(configService);
    return new Redis({
      ...config,
      role: 'slave',
      readOnly: true,
    });
  },
};

export const BullMqConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const config = getSentinelConfig(configService);
    return {
      connection: config,
    };
  },
};