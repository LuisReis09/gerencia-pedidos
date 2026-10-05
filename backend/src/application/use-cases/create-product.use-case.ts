import { ConflictError } from '../../domain/errors/domain.error';
import { Product } from '../../domain/entities/product';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { randomUUID } from 'node:crypto';

export type CreateProductInput = {
  id?: string;
  name: string;
  sku?: string;
  description?: string;
};

export class CreateProductUseCase {
  constructor(private readonly products: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const sku = input.sku?.trim();
    const id = input.id?.trim() || randomUUID();
    if (await this.products.findById(id)) {
      throw new ConflictError(`Já existe um produto com o identificador ${id}.`);
    }
    if (sku && (await this.products.findBySku(sku))) {
      throw new ConflictError(`Já existe um produto com o SKU ${sku}.`);
    }

    const product = new Product({
      id,
      name: input.name,
      sku,
      description: input.description,
      createdAt: new Date(),
    });
    await this.products.save(product);
    return product;
  }
}
