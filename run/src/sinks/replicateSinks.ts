import { Subscriber, Subscription } from 'most'

import { Subject } from 'most-subject'
import { get } from '../helpers'

export function replicateSinks<Sinks>(
  sinks: Sinks,
  sinkProxies: Sinks): Array<Subscription<any>>
{
  return Object.keys(sinks)
    .filter((sinkName) => get(sinkProxies, sinkName))
    .map(function createSubscription(sinkName: string): Subscription<any> {
      const sink = get(sinks, sinkName)
      const sinkProxy = get(sinkProxies, sinkName)

      return sink.subscribe(createSubscriber(sinkProxy, sinkName))
    })
}

function createSubscriber(subject: Subject<any>, sinkName: string): Subscriber<any> {
  return {
    next(value: any) {
      subject.next(value)
    },

    error(err: Error) {
      subject.error(err)
      logError(err, sinkName)
    },

    complete(value?: any) {
      subject.complete(value)
    },
  }
}

function logError(err: Error, driverName: string) {
  console.error(
    `${driverName} has failed for the following reason: ` +
    `${err.message}` +
    `${err.stack || err}`,
  )
}
