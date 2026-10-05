import { InvalidDataError, ProductWithoutCostError } from '../../domain/errors/domain.error';
import { Money } from '../../domain/value-objects/money';
import type { OrderRepository } from '../../domain/repositories/order.repository';
import type { ProductCostRepository } from '../../domain/repositories/product-cost.repository';

export type DashboardFilter = { startDate?: Date; endDate?: Date; productIds?: string[] };
export type DashboardPoint = {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  orderCount: number;
};
export type DashboardResult = {
  orderCount: number;
  revenue: number;
  cost: number;
  profit: number;
  series: DashboardPoint[];
};

export class GetDashboardUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly costs: ProductCostRepository,
  ) {}

  async execute(filter: DashboardFilter = {}): Promise<DashboardResult> {
    if (filter.startDate && filter.endDate && filter.startDate > filter.endDate) {
      throw new InvalidDataError('A data inicial não pode ser posterior à data final.');
    }
    const selectedProducts = new Set(filter.productIds ?? []);
    const orders = (await this.orders.findAll())
      .filter((order) => this.isInPeriod(order.createdAt, filter))
      .map((order) => ({
        order,
        items: order.items.filter((item) => selectedProducts.size === 0 || selectedProducts.has(item.productId)),
      }))
      .filter(({ items }) => items.length > 0);
    const costs = await this.costs.findAll();
    const costsByProduct = new Map(costs.map((cost) => [cost.productId, cost]));
    let revenue = Money.zero();
    let cost = Money.zero();
    const points = new Map<string, { revenue: Money; cost: Money; orderCount: number }>();

    for (const { order, items } of orders) {
      let orderRevenue = Money.zero();
      let orderCost = Money.zero();
      for (const item of items) {
        orderRevenue = orderRevenue.add(item.total());
        const productCost = costsByProduct.get(item.productId);
        if (!productCost) {
          throw new ProductWithoutCostError(`O produto ${item.productName} não possui custo cadastrado.`);
        }
        orderCost = orderCost.add(productCost.amount.multiply(item.quantity));
      }
      revenue = revenue.add(orderRevenue);
      cost = cost.add(orderCost);
      const key = order.createdAt.toISOString().slice(0, 10);
      const point = points.get(key) ?? { revenue: Money.zero(), cost: Money.zero(), orderCount: 0 };
      point.revenue = point.revenue.add(orderRevenue);
      point.cost = point.cost.add(orderCost);
      point.orderCount += 1;
      points.set(key, point);
    }

    return {
      orderCount: orders.length,
      revenue: revenue.toNumber(),
      cost: cost.toNumber(),
      profit: revenue.subtract(cost).toNumber(),
      series: [...points.entries()].sort(([first], [second]) => first.localeCompare(second)).map(([date, point]) => ({
        date,
        revenue: point.revenue.toNumber(),
        cost: point.cost.toNumber(),
        profit: point.revenue.subtract(point.cost).toNumber(),
        orderCount: point.orderCount,
      })),
    };
  }

  private isInPeriod(date: Date, filter: DashboardFilter): boolean {
    const time = date.getTime();
    return (!filter.startDate || time >= filter.startDate.getTime()) && (!filter.endDate || time <= filter.endDate.getTime());
  }
}
