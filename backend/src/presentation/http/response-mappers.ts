import { Order } from '../../domain/entities/order';
import { Product } from '../../domain/entities/product';
import { ProductCost } from '../../domain/entities/product-cost';

export const productResponse = (product: Product) => ({
  id: product.id,
  name: product.name,
  sku: product.sku ?? null,
  description: product.description ?? null,
  createdAt: product.createdAt.toISOString(),
});

export const costResponse = (cost: ProductCost) => ({
  productId: cost.productId,
  amount: cost.amount.toNumber(),
  updatedAt: cost.updatedAt.toISOString(),
});

export const orderResponse = (order: Order) => ({
  id: order.id,
  buyer: { name: order.buyerName, email: order.buyerEmail },
  items: order.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toNumber(),
    total: item.total().toNumber(),
  })),
  totalAmount: order.totalAmount.toNumber(),
  createdAt: order.createdAt.toISOString(),
});
