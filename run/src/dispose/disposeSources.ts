import { Object, DisposableSource } from '../types';
import { get } from '../helpers';

export function disposeSources<Sources extends Object<any>> (sources: Sources) {
  Object.keys(sources)
    .forEach(function disposeSource (sourceName: string) {
      const source: DisposableSource = get(sources, sourceName);

      return source.dispose && source.dispose();
    });
}
