import { Entity } from '../Entity';
import { Title } from '../Title';

export class Item extends Entity {
  private _completed: boolean;

  private _title: Title;

  constructor(id: number, completed: boolean, title: Title) {
    super(id);

    this._completed = completed;
    this._title = title;
  }

  public completed(): boolean {
    return this._completed;
  }

  public title(): Title {
    return this._title;
  }
}
