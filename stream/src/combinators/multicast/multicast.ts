import { Multicast } from './MulticastSource'
import { MulticastStream } from '../../types'
import { Stream } from '@most/types'

export const multicast = <A>(stream: Stream<A>): MulticastStream<A> => new Multicast(stream)
