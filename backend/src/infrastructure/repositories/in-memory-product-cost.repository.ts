import { ProductCost } from '../../domain/entities/product-cost';
import { ProductCostRepository } from '../../domain/repositories/product-cost.repository';

export class InMemoryProductCostRepository implements ProductCostRepository {
  private readonly costs = new Map<string, ProductCost>();

  async findAll(): Promise<ProductCost[]> {
    return [...this.costs.values()];
  }

  async findByProductId(productId: string): Promise<ProductCost | undefined> {
    return this.costs.get(productId);
  }

  async save(cost: ProductCost): Promise<void> {
    this.costs.set(cost.productId, cost);
  }
}
