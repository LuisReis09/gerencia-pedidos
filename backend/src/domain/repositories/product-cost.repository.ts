import { ProductCost } from '../entities/product-cost';

export interface ProductCostRepository {
  findAll(): Promise<ProductCost[]>;
  findByProductId(productId: string): Promise<ProductCost | undefined>;
  save(cost: ProductCost): Promise<void>;
}

export const PRODUCT_COST_REPOSITORY = Symbol('PRODUCT_COST_REPOSITORY');
