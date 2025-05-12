export abstract class ValueObject<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }
  toString(): string {
    return JSON.stringify(this._value);
  }
  get value(): T {
    return this._value;
  }
}
