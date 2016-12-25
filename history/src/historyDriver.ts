import { Stream } from 'most';
import { Location, Path, createHistory } from 'prehistoric';
import { HistoryInput } from './types';

export function historyDriver(sink$: Stream<HistoryInput | Path>): Stream<Location> {
  const { push, replace, go, history } = createHistory();

  sink$.observe(function (input: HistoryInput | Path) {
    if (typeof input === 'string')
      return push(input);

    if (input.type === 'push')
      return push(input.path, input.state);

    if (input.type === 'replace')
      return replace(input.path, input.state);

    if (input.type === 'go')
      return go(input.amount);

    if (input.type === 'goBack')
      return go(-1);

    if (input.type === 'goForward')
      return go(1);
  });

  return history;
}
