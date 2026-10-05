import { ProductCost } from '../../domain/entities/product-cost';
import { ResourceNotFoundError } from '../../domain/errors/domain.error';
import type { ProductCostRepository } from '../../domain/repositories/product-cost.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { Money } from '../../domain/value-objects/money';

export class UpdateProductCostUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly costs: ProductCostRepository,
  ) {}

  async execute(productId: string, amount: string | number): Promise<ProductCost> {
    if (!(await this.products.findById(productId))) {
      throw new ResourceNotFoundError(`Produto ${productId} não encontrado.`);
    }

    const cost = new ProductCost({
      productId,
      amount: Money.from(amount),
      updatedAt: new Date(),
    });
    await this.costs.save(cost);
    return cost;
  }
}
