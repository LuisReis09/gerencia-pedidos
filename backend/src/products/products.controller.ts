import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from '../application/dto/create-product.dto';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case';
import { productResponse } from '../presentation/http/response-mappers';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly listProducts: ListProductsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return productResponse(await this.createProduct.execute(dto));
  }

  @Get()
  async list() {
    return (await this.listProducts.execute()).map(productResponse);
  }
}
