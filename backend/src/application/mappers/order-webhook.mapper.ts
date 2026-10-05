import { OrderItem, Order } from '../../domain/entities/order';
import { Money } from '../../domain/value-objects/money';
import { OrderWebhookDto } from '../dto/order-webhook.dto';

export class OrderWebhookMapper {
  toDomain(payload: OrderWebhookDto): Order {
    const items = payload.lineItems.map(
      (item) =>
        new OrderItem({
          productId: item.itemId,
          productName: item.itemName,
          quantity: item.qty,
          unitPrice: Money.from(item.unitPrice),
        }),
    );

    return new Order({
      id: payload.id,
      buyerName: payload.buyer.buyerName,
      buyerEmail: payload.buyer.buyerEmail,
      items,
      totalAmount: Money.from(payload.totalAmount),
      createdAt: new Date(payload.createdAt),
    });
  }
}
