import { Order } from '../../domain/entities/order';
import { OrderRepository } from '../../domain/repositories/order.repository';

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  async findAll(): Promise<Order[]> {
    return [...this.orders.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}
