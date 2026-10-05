import { Global, Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository';
import { PRODUCT_COST_REPOSITORY } from '../domain/repositories/product-cost.repository';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { InMemoryProductCostRepository } from './repositories/in-memory-product-cost.repository';
import { InMemoryProductRepository } from './repositories/in-memory-product.repository';

@Global()
@Module({
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository },
    { provide: PRODUCT_COST_REPOSITORY, useClass: InMemoryProductCostRepository },
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
  ],
  exports: [PRODUCT_REPOSITORY, PRODUCT_COST_REPOSITORY, ORDER_REPOSITORY],
})
export class PersistenceModule {}
