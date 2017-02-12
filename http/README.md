# @motorcycle/http

> Motorcycle Components and functions for dealing with HTTP

This is a thin abstraction and helpful functions built on top of
[`most-request`](https://github.com/TylorS/most-request), which uses
[`superagent`](https://github.com/visionmedia/superagent) under the hood.

## Let me have it!
```sh
yarn add @motorcycle/http
# or
npm install --save @motorcycle/http
```

## API

- All functions of arity 2 or more are curried for you!
- Types not described in the API can be found in the [Types](#types) section.

### `Http(sinks: HttpSinks): HttpSources`

Effectful component for making HTTP requests and retrieving HTTP responses.

```typescript
import { run } from '@motorcycle/run';
import { Http } from '@motorcycle/http';

function Effects(sinks) {
  const { response$$ } = Http(sinks);

  return { response$$ }
}

run(Main, Effects);
```

### `request(method: HTTPMethod, url: string): RequestOptions`

Create simple `RequestOptions` objects for use with `Http` component.

```typescript
function Main(sources) {
  const { dom } = sources;

  ...

  const request$ = constant(request('GET', URL), makeRequest$);

  return { request$ }
}
```

There are also many functions similar to `request` that are for particular HTTP
methods, all of which take a URL string and return `RequestOptions`.

- `get(url: string): RequestOptions`
- `head(url: string): RequestOptions`
- `post(url: string): RequestOptions`
- `put(url: string): RequestOptions`
- `del(url: string): RequestOptions`
- `connect(url: string): RequestOptions`
- `options(url: string): RequestOptions`
- `trace(url: string): RequestOptions`
- `patch(url: string): RequestOptions`

## Types

All of the types used in the API section.

```typescript
export interface HttpSinks {
    request$: Stream<RequestOptions>;
}

export interface HttpSources {
    response$$: Stream<ResponseStream>;
}

export interface Response {
    text: string;
    body: any;
    files: any;
    header: any;
    type: string;
    charset: string;
    status: number;
    statusType: number;
    info: boolean;
    ok: boolean;
    redirect: boolean;
    clientError: boolean;
    serverError: boolean;
    error: Error;
    accepted: boolean;
    noContent: boolean;
    badRequest: boolean;
    unauthorized: boolean;
    notAcceptable: boolean;
    notFound: boolean;
    forbidden: boolean;
    xhr: XMLHttpRequest;
    get(header: string): string;
}

export declare type HTTPMethod =
  'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export interface RequestOptions {
    url: string;
    method: HTTPMethod;
    query?: Object;
    send?: Object;
    headers?: Object;
    accept?: string;
    type?: string;
    user?: string;
    password?: string;
    field?: Object;
    progress?: boolean;
    attach?: Array<Attachment>;
    agent?: AgentOptions;
    withCredentials?: boolean;
    redirects?: number;
    lazy?: boolean;
}

export interface Attachment {
    name: string;
    path: string;
    filename?: string;
}

export interface AgentOptions {
    key: string;
    cert: string;
}
```