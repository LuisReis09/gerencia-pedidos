import { Product } from '../../domain/entities/product';
import { ProductRepository } from '../../domain/repositories/product.repository';

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  async findAll(): Promise<Product[]> {
    return [...this.products.values()];
  }

  async findById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async findBySku(sku: string): Promise<Product | undefined> {
    return [...this.products.values()].find((product) => product.sku === sku);
  }

  async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }
}
