import { InvalidDataError } from '../errors/domain.error';
import { Money } from '../value-objects/money';

export type OrderItemProps = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Money;
};

export class OrderItem {
  readonly productId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: Money;

  constructor(props: OrderItemProps) {
    if (!props.productId.trim() || !props.productName.trim()) {
      throw new InvalidDataError('Item do pedido deve possuir produto.');
    }
    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new InvalidDataError('A quantidade do item deve ser maior que zero.');
    }

    this.productId = props.productId;
    this.productName = props.productName;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
  }

  total(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}

export type OrderProps = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  totalAmount: Money;
  createdAt: Date;
};

export class Order {
  readonly id: string;
  readonly buyerName: string;
  readonly buyerEmail: string;
  readonly items: readonly OrderItem[];
  readonly totalAmount: Money;
  readonly createdAt: Date;

  constructor(props: OrderProps) {
    if (!props.id.trim() || !props.buyerName.trim() || !props.buyerEmail.trim() || props.items.length === 0) {
      throw new InvalidDataError('Pedido deve possuir identificador, comprador e itens.');
    }

    this.id = props.id;
    this.buyerName = props.buyerName;
    this.buyerEmail = props.buyerEmail;
    this.items = [...props.items];
    this.totalAmount = props.totalAmount;
    this.createdAt = new Date(props.createdAt);

    const calculatedTotal = this.items.reduce((total, item) => total.add(item.total()), Money.zero());
    if (calculatedTotal.toCents() !== this.totalAmount.toCents()) {
      throw new InvalidDataError('O total do pedido não corresponde à soma dos itens.');
    }
  }
}
