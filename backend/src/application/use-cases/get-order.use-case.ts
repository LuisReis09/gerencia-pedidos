import { ResourceNotFoundError } from '../../domain/errors/domain.error';
import { Order } from '../../domain/entities/order';
import type { OrderRepository } from '../../domain/repositories/order.repository';

export class GetOrderUseCase {
  constructor(private readonly orders: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orders.findById(id);
    if (!order) {
      throw new ResourceNotFoundError(`Pedido ${id} não encontrado.`);
    }
    return order;
  }
}
