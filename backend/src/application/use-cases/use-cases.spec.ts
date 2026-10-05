import { CreateOrderUseCase } from './create-order.use-case';
import { CreateProductUseCase } from './create-product.use-case';
import { GetDashboardUseCase } from './get-dashboard.use-case';
import { UpdateProductCostUseCase } from './update-product-cost.use-case';
import { OrderWebhookMapper } from '../mappers/order-webhook.mapper';
import { OrderWebhookDto } from '../dto/order-webhook.dto';
import { InMemoryOrderRepository } from '../../infrastructure/repositories/in-memory-order.repository';
import { InMemoryProductCostRepository } from '../../infrastructure/repositories/in-memory-product-cost.repository';
import { InMemoryProductRepository } from '../../infrastructure/repositories/in-memory-product.repository';
import { ProductWithoutCostError } from '../../domain/errors/domain.error';

describe('order and dashboard use cases', () => {
  const payload: OrderWebhookDto = {
    id: 'ORD-98432',
    buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
      { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
    ],
    totalAmount: 229.7,
    createdAt: '2025-02-10T14:32:00Z',
  };

  it('maps the external webhook without leaking its shape into the domain', () => {
    const order = new OrderWebhookMapper().toDomain(payload);

    expect(order.id).toBe('ORD-98432');
    expect(order.items[0].quantity).toBe(2);
    expect(order.totalAmount.toString()).toBe('229.70');
  });

  it('creates products, updates costs and calculates revenue, cost and profit', async () => {
    const products = new InMemoryProductRepository();
    const costs = new InMemoryProductCostRepository();
    const orders = new InMemoryOrderRepository();
    const createProduct = new CreateProductUseCase(products);
    const updateCost = new UpdateProductCostUseCase(products, costs);
    const createOrder = new CreateOrderUseCase(orders, products);

    const shirt = await createProduct.execute({ name: 'Camiseta Básica', sku: 'P-001' });
    const jeans = await createProduct.execute({ name: 'Calça Jeans', sku: 'P-002' });
    await updateCost.execute(shirt.id, 20);
    await updateCost.execute(jeans.id, 70);

    const order = new OrderWebhookMapper().toDomain({
      id: payload.id,
      buyer: payload.buyer,
      totalAmount: payload.totalAmount,
      createdAt: payload.createdAt,
      lineItems: [
        { itemId: shirt.id, itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
        { itemId: jeans.id, itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
      ],
    });
    await createOrder.execute(order);

    const dashboard = await new GetDashboardUseCase(orders, costs).execute();
    expect(dashboard).toEqual({
      orderCount: 1,
      revenue: 229.7,
      cost: 110,
      profit: 119.7,
      series: [{ date: '2025-02-10', revenue: 229.7, cost: 110, profit: 119.7, orderCount: 1 }],
    });

    const filtered = await new GetDashboardUseCase(orders, costs).execute({ productIds: [shirt.id] });
    expect(filtered).toEqual({
      orderCount: 1,
      revenue: 99.8,
      cost: 40,
      profit: 59.8,
      series: [{ date: '2025-02-10', revenue: 99.8, cost: 40, profit: 59.8, orderCount: 1 }],
    });
  });

  it('filters dashboard orders by date and reports products without cost', async () => {
    const products = new InMemoryProductRepository();
    const costs = new InMemoryProductCostRepository();
    const orders = new InMemoryOrderRepository();
    const product = await new CreateProductUseCase(products).execute({ name: 'Produto' });
    const order = new OrderWebhookMapper().toDomain({
      id: payload.id,
      buyer: payload.buyer,
      totalAmount: 99.8,
      createdAt: payload.createdAt,
      lineItems: [{ itemId: product.id, itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 }],
    });
    await new CreateOrderUseCase(orders, products).execute(order);
    const dashboard = new GetDashboardUseCase(orders, costs);

    await expect(dashboard.execute({ startDate: new Date('2026-01-01') })).resolves.toEqual({
      orderCount: 0,
      revenue: 0,
      cost: 0,
      profit: 0,
      series: [],
    });
    await expect(dashboard.execute()).rejects.toBeInstanceOf(ProductWithoutCostError);
  });
});
