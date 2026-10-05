import { IsOptional, IsString } from 'class-validator';

export class OrdersQueryDto {
  @IsOptional()
  @IsString()
  productIds?: string;
}
