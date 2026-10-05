import { Test, TestingModule } from '@nestjs/testing';
import { ProductCostsController } from './product-costs.controller';

describe('ProductCostsController', () => {
  let controller: ProductCostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCostsController],
    }).compile();

    controller = module.get<ProductCostsController>(ProductCostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
