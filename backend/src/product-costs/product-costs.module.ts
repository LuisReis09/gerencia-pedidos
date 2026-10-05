import { Module } from '@nestjs/common';
import { ListProductCostsUseCase } from '../application/use-cases/list-product-costs.use-case';
import { UpdateProductCostUseCase } from '../application/use-cases/update-product-cost.use-case';
import { PRODUCT_COST_REPOSITORY } from '../domain/repositories/product-cost.repository';
import type { ProductCostRepository } from '../domain/repositories/product-cost.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';
import type { ProductRepository } from '../domain/repositories/product.repository';
import { ProductCostsController } from './product-costs.controller';

@Module({
  controllers: [ProductCostsController],
  providers: [
    {
      provide: ListProductCostsUseCase,
      useFactory: (products: ProductRepository, costs: ProductCostRepository) => new ListProductCostsUseCase(products, costs),
      inject: [PRODUCT_REPOSITORY, PRODUCT_COST_REPOSITORY],
    },
    {
      provide: UpdateProductCostUseCase,
      useFactory: (products: ProductRepository, costs: ProductCostRepository) => new UpdateProductCostUseCase(products, costs),
      inject: [PRODUCT_REPOSITORY, PRODUCT_COST_REPOSITORY],
    },
  ],
})
export class ProductCostsModule {}
