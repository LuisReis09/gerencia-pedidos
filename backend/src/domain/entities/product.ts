import { InvalidDataError } from '../errors/domain.error';

export type ProductProps = {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  createdAt: Date;
};

export class Product {
  readonly id: string;
  readonly name: string;
  readonly sku?: string;
  readonly description?: string;
  readonly createdAt: Date;

  constructor(props: ProductProps) {
    if (!props.id.trim() || !props.name.trim()) {
      throw new InvalidDataError('Produto deve possuir identificador e nome.');
    }

    this.id = props.id.trim();
    this.name = props.name.trim();
    this.sku = props.sku?.trim() || undefined;
    this.description = props.description?.trim() || undefined;
    this.createdAt = new Date(props.createdAt);
  }
}
