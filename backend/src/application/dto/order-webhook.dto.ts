import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ExternalBuyerDto {
  @IsString()
  buyerName!: string;

  @IsEmail()
  buyerEmail!: string;
}

export class ExternalLineItemDto {
  @IsString()
  itemId!: string;

  @IsString()
  itemName!: string;

  @IsInt()
  @IsPositive()
  qty!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  unitPrice!: number;
}

export class OrderWebhookDto {
  @IsString()
  id!: string;

  @ValidateNested()
  @Type(() => ExternalBuyerDto)
  buyer!: ExternalBuyerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExternalLineItemDto)
  lineItems!: ExternalLineItemDto[];

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  totalAmount!: number;

  @IsISO8601()
  createdAt!: string;
}
