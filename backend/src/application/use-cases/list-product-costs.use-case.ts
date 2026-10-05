import { ProductCost } from '../../domain/entities/product-cost';
import type { ProductCostRepository } from '../../domain/repositories/product-cost.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

export type ProductCostView = {
  productId: string;
  productName: string;
  amount: number | null;
  updatedAt: string | null;
};

export class ListProductCostsUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly costs: ProductCostRepository,
  ) {}

  async execute(): Promise<ProductCostView[]> {
    const products = await this.products.findAll();
    const costs = await this.costs.findAll();
    const costsByProduct = new Map(costs.map((cost) => [cost.productId, cost]));

    return products.map((product) => this.toView(product.id, product.name, costsByProduct.get(product.id)));
  }

  private toView(productId: string, productName: string, cost?: ProductCost): ProductCostView {
    return {
      productId,
      productName,
      amount: cost?.amount.toNumber() ?? null,
      updatedAt: cost?.updatedAt.toISOString() ?? null,
    };
  }
}
