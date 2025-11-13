import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisConfig: Provider = {
  provide: 'REDIS',
  useFactory: () => {
    // 1. .env에서 센티넬 호스트 목록 문자열을 읽어옵니다.
    const sentinelHosts = process.env.REDIS_SENTINEL_HOSTS;
    const masterName = process.env.REDIS_MASTER_NAME;

    if (!sentinelHosts || !masterName) {
      throw new Error('Redis Sentinel 설정이 .env 파일에 필요합니다.');
    }

    // 2. 문자열을 파싱하여 { host, port } 객체 배열로 변환합니다.
    const sentinels = sentinelHosts.split(',').map((hostPort) => {
      const [host, port] = hostPort.split(':');
      if (!host || !port) {
        throw new Error(`잘못된 Sentinel 호스트 형식입니다: ${hostPort}`);
      }
      return { host, port: Number(port) };
    });

    // 3. ioredis Sentinel 클라이언트를 생성합니다.
    return new Redis({
      sentinels: sentinels,
      name: masterName,
      // (선택사항) 읽기 작업을 Slave에서 하려면
      // readOnly: true, 
      // role: 'slave', 
    });
  },
};