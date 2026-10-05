import { InvalidDataError } from '../errors/domain.error';

export class Money {
  private constructor(private readonly cents: number) {}

  static from(value: string | number): Money {
    const text = typeof value === 'number' ? value.toString() : value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(text) || !Number.isFinite(Number(text))) {
      throw new InvalidDataError('O valor deve ser um número positivo com até duas casas decimais.');
    }

    const [whole, fraction = ''] = text.split('.');
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));

    if (!Number.isSafeInteger(cents)) {
      throw new InvalidDataError('O valor informado é muito grande.');
    }

    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  multiply(quantity: number): Money {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new InvalidDataError('A quantidade deve ser um inteiro positivo.');
    }

    const result = this.cents * quantity;
    if (!Number.isSafeInteger(result)) {
      throw new InvalidDataError('O resultado financeiro é muito grande.');
    }
    return new Money(result);
  }

  subtract(other: Money): Money {
    return new Money(this.cents - other.cents);
  }

  toCents(): number {
    return this.cents;
  }

  toNumber(): number {
    return this.cents / 100;
  }

  toString(): string {
    return (this.cents / 100).toFixed(2);
  }
}
