import { Module } from '@nestjs/common';
import { ProductCostsController } from './product-costs.controller';

@Module({
  controllers: [ProductCostsController]
})
export class ProductCostsModule {}
