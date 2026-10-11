import { Controller, Get } from '@nestjs/common';
import type { ReportsSummary } from '@attendance/shared';
import { RequirePermissions } from '../../common/decorators';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  @RequirePermissions('reports.view')
  getSummary(): Promise<ReportsSummary> {
    return this.reportsService.getSummary();
  }
}
