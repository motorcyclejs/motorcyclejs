import { ValueObject } from './ValueObject';

export abstract class Entity implements ValueObject {
  private _id: number;

  constructor(id: number) {
    this._id = id;
  }

  public id(): number {
    return this._id;
  }
}
