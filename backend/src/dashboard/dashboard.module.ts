import { Module } from '@nestjs/common';
import { GetDashboardUseCase } from '../application/use-cases/get-dashboard.use-case';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository';
import type { OrderRepository } from '../domain/repositories/order.repository';
import { PRODUCT_COST_REPOSITORY } from '../domain/repositories/product-cost.repository';
import type { ProductCostRepository } from '../domain/repositories/product-cost.repository';
import { DashboardController } from './dashboard.controller';

@Module({
  controllers: [DashboardController],
  providers: [{
    provide: GetDashboardUseCase,
    useFactory: (orders: OrderRepository, costs: ProductCostRepository) => new GetDashboardUseCase(orders, costs),
    inject: [ORDER_REPOSITORY, PRODUCT_COST_REPOSITORY],
  }],
})
export class DashboardModule {}
