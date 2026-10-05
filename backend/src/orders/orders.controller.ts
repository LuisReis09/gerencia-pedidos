import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case';
import { orderResponse } from '../presentation/http/response-mappers';
import { OrdersQueryDto } from './orders-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly listOrders: ListOrdersUseCase,
    private readonly getOrder: GetOrderUseCase,
  ) {}

  @Get()
  async list(@Query() query: OrdersQueryDto) {
    const productIds = query.productIds?.split(',').map((id) => id.trim()).filter(Boolean) ?? [];
    return (await this.listOrders.execute(productIds)).map(orderResponse);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return orderResponse(await this.getOrder.execute(id));
  }
}
