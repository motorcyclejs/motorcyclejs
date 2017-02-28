import { RequestOptions, ResponseStream, request } from 'most-request';
import { Stream, drain, map, tap } from 'most';

import { hold } from '@most/hold';

export interface HttpSinks {
  request$: Stream<RequestOptions>;
}

export interface HttpSources {
  response$$: Stream<ResponseStream>;
}

export function Http(sinks: HttpSinks): HttpSources {
  const { request$ } = sinks;

  const response$$: Stream<ResponseStream> =
    hold(tap<ResponseStream>(drain, map(request, request$)));

  drain(response$$);

  return { response$$ };
}
