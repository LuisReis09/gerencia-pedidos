import { Product } from '../../domain/entities/product';
import type { ProductRepository } from '../../domain/repositories/product.repository';

export class ListProductsUseCase {
  constructor(private readonly products: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}
