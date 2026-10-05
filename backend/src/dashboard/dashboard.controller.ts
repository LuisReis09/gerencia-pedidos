import { Controller, Get, Query } from '@nestjs/common';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';
import { DashboardQueryDto } from './dashboard-query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly getDashboard: GetDashboardUseCase) {}

  @Get()
  execute(@Query() query: DashboardQueryDto) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? this.toEndOfDay(query.endDate) : undefined;
    return this.getDashboard.execute({ startDate, endDate, productIds: this.parseProductIds(query.productIds) });
  }

  private parseProductIds(value?: string): string[] {
    return value?.split(',').map((id) => id.trim()).filter(Boolean) ?? [];
  }

  private toEndOfDay(value: string): Date {
    const endDate = new Date(value);
    if (value.length === 10) endDate.setUTCHours(23, 59, 59, 999);
    return endDate;
  }
}
