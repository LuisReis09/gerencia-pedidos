import { Module } from '@nestjs/common';
import { OrderWebhookMapper } from '../application/mappers/order-webhook.mapper';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository';
import type { OrderRepository } from '../domain/repositories/order.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';
import type { ProductRepository } from '../domain/repositories/product.repository';
import { OrdersController } from './orders.controller';
import { WebhookOrdersController } from './webhook-orders.controller';

@Module({
  controllers: [OrdersController, WebhookOrdersController],
  providers: [
    {
      provide: CreateOrderUseCase,
      useFactory: (orders: OrderRepository, products: ProductRepository) => new CreateOrderUseCase(orders, products),
      inject: [ORDER_REPOSITORY, PRODUCT_REPOSITORY],
    },
    {
      provide: GetOrderUseCase,
      useFactory: (orders: OrderRepository) => new GetOrderUseCase(orders),
      inject: [ORDER_REPOSITORY],
    },
    {
      provide: ListOrdersUseCase,
      useFactory: (orders: OrderRepository) => new ListOrdersUseCase(orders),
      inject: [ORDER_REPOSITORY],
    },
    OrderWebhookMapper,
  ],
})
export class OrdersModule {}
