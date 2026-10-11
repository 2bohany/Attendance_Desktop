import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { HealthCheckResponse } from '@attendance/shared';
import { Public } from '../../common/decorators';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  check(): Promise<HealthCheckResponse> {
    return this.healthService.check();
  }
}
