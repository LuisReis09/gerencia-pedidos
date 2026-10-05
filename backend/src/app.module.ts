import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ProductCostsModule } from './product-costs/product-costs.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PersistenceModule } from './infrastructure/persistence.module';

@Module({
  imports: [
    PersistenceModule,
    ProductsModule,
    ProductCostsModule,
    OrdersModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
