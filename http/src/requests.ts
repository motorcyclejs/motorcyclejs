import { HTTPMethod, RequestOptions } from 'most-request'

import { curry2 } from '@most/prelude'

export const request: RequestFn = curry2(
  function request(method: HTTPMethod, url: string): RequestOptions {
    return { method, url }
  },
)

export interface RequestFn {
  (method: HTTPMethod, url: string): RequestOptions
  (method: HTTPMethod): (url: string) => RequestOptions
}

export const get = request('GET')
export const head = request('HEAD')
export const post = request('POST')
export const put = request('PUT')
export const del = request('DELETE')
export const connect = request('CONNECT')
export const options = request('OPTIONS')
export const trace = request('TRACE')
export const patch = request('PATCH')
