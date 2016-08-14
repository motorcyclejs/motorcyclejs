import { Stream, empty } from 'most'
import { EventsFnOptions } from './DOMSource'

export class HTMLSource {
  private _html$: any
  private _empty$: any

  constructor(html$: Stream<string>) {
    this._html$ = html$
    this._empty$ = empty()
  }

  elements (): any {
    return this._html$
  }

  public select(selector: string): HTMLSource {
    // to avoid errors about not using selector
    const html$ = void selector ? empty() : empty()
    return new HTMLSource(html$)
  }

  public events(eventType: string, options?: EventsFnOptions): Stream<Event> {
    const x = void eventType ? void 0 : void 0
    const y = void options ? void 0 : void 0
    return x || y ? this._empty$ as Stream<Event> : this._empty$ as Stream<Event>
  }
}
