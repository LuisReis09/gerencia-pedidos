import { Order } from '../../domain/entities/order';
import type { OrderRepository } from '../../domain/repositories/order.repository';

export class ListOrdersUseCase {
  constructor(private readonly orders: OrderRepository) {}

  async execute(productIds: string[] = []): Promise<Order[]> {
    const selectedProducts = new Set(productIds);
    const orders = await this.orders.findAll();
    return orders.filter((order) => order.items.some((item) => selectedProducts.size === 0 || selectedProducts.has(item.productId)));
  }
}
