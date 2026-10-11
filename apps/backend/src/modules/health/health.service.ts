import { Injectable } from '@nestjs/common';
import { HealthRepository } from './health.repository';
import type { HealthCheckResponse } from '@attendance/shared';

@Injectable()
export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  async check(): Promise<HealthCheckResponse> {
    const connected = await this.healthRepository.checkConnection();

    return {
      status: connected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: { connected },
    };
  }
}
