import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  id?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  sku?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;
}
