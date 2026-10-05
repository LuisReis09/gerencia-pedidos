import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UpdateProductCostDto } from '../application/dto/update-product-cost.dto';
import { ListProductCostsUseCase } from '../application/use-cases/list-product-costs.use-case';
import { UpdateProductCostUseCase } from '../application/use-cases/update-product-cost.use-case';
import { costResponse } from '../presentation/http/response-mappers';

@Controller('products')
export class ProductCostsController {
  constructor(
    private readonly listCosts: ListProductCostsUseCase,
    private readonly updateCost: UpdateProductCostUseCase,
  ) {}

  @Get('costs')
  list() {
    return this.listCosts.execute();
  }

  @Put(':id/cost')
  async update(@Param('id') id: string, @Body() dto: UpdateProductCostDto) {
    return costResponse(await this.updateCost.execute(id, dto.amount));
  }
}
