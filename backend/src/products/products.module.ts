import { Module } from '@nestjs/common';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { PRODUCT_REPOSITORY } from '../domain/repositories/product.repository';
import type { ProductRepository } from '../domain/repositories/product.repository';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: CreateProductUseCase,
      useFactory: (products: ProductRepository) => new CreateProductUseCase(products),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (products: ProductRepository) => new ListProductsUseCase(products),
      inject: [PRODUCT_REPOSITORY],
    },
  ],
})
export class ProductsModule {}
