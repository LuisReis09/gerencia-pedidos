import { Order } from '../entities/order';

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | undefined>;
  save(order: Order): Promise<void>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
