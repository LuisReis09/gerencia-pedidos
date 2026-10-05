import { Body, Controller, Post } from '@nestjs/common';
import { OrderWebhookDto } from '../application/dto/order-webhook.dto';
import { OrderWebhookMapper } from '../application/mappers/order-webhook.mapper';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { orderResponse } from '../presentation/http/response-mappers';

@Controller('webhooks/orders')
export class WebhookOrdersController {
  constructor(
    private readonly mapper: OrderWebhookMapper,
    private readonly createOrder: CreateOrderUseCase,
  ) {}

  @Post()
  async receive(@Body() dto: OrderWebhookDto) {
    const order = this.mapper.toDomain(dto);
    return orderResponse(await this.createOrder.execute(order));
  }
}
