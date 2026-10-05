import { Money } from '../value-objects/money';

export type ProductCostProps = {
  productId: string;
  amount: Money;
  updatedAt: Date;
};

export class ProductCost {
  readonly productId: string;
  readonly amount: Money;
  readonly updatedAt: Date;

  constructor(props: ProductCostProps) {
    this.productId = props.productId;
    this.amount = props.amount;
    this.updatedAt = new Date(props.updatedAt);
  }
}
