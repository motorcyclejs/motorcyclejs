import { ValueObject } from './ValueObject';

export class Title implements ValueObject {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public value(): string {
    return this._value;
  }
}
