export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidDataError extends DomainError {
  readonly code = 'INVALID_DATA';
}

export class ResourceNotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';
}

export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';
}

export class ProductWithoutCostError extends DomainError {
  readonly code = 'PRODUCT_WITHOUT_COST';
}
