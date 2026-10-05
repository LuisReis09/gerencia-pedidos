import { ConflictError, ResourceNotFoundError } from '../../domain/errors/domain.error';
import { Order } from '../../domain/entities/order';
import type { OrderRepository } from '../../domain/repositories/order.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

export class CreateOrderUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly products: ProductRepository,
  ) {}

  async execute(order: Order): Promise<Order> {
    if (await this.orders.findById(order.id)) {
      throw new ConflictError(`O pedido ${order.id} já foi recebido.`);
    }

    const productIds = [...new Set(order.items.map((item) => item.productId))];
    const missingProduct = (await Promise.all(productIds.map((id) => this.products.findById(id)))).some(
      (product) => !product,
    );
    if (missingProduct) {
      throw new ResourceNotFoundError('Um ou mais produtos do pedido não estão cadastrados.');
    }

    await this.orders.save(order);
    return order;
  }
}
