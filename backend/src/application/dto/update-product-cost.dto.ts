import { IsNumber, Min } from 'class-validator';

export class UpdateProductCostDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;
}
