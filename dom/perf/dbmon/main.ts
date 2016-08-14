/* global ENV, Monitoring */
declare const ENV: any
declare const Monitoring: any

import { Subject, subject } from 'most-subject'
import Cycle from '@cycle/most-run'
import {makeDOMDriver, h} from '../../src'

function map<T, R> (arr: Array<T>, fn: (t: T, i: number) => R) {
  const l = arr.length
  const mappedArr = Array(l)
  for (let i = 0; i < l; ++i) {
    mappedArr[i] = fn(arr[i], i)
  }
  return mappedArr
}

function dbMap (q: any) {
  return h('td.' + q.elapsedClassName, [
    h('span.foo', [q.formatElapsed]),
    h('div.popover.left', [
      h('div.popover-content', [
        q.query
      ]),
      h('div.arrow')
    ])
  ])
}

function databasesMap (db: any) {
  return h('tr', [
    h('td.dbname', [db.dbname]),
    h('td.query-count', [
      h('span.' + db.lastSample.countClassName, [
        db.lastSample.nbQueries
      ])
    ])
  ].concat(map(db.lastSample.topFiveQueries, dbMap)))
}

function mainMap (databases: any) {
  return h('div', {static: true}, [
    h('table.table.table-striped.latest-data', {}, [
      h('tbody', map(databases, databasesMap))
    ])
  ])
}

function main (sources: any) {
  return {
    DOM: sources.databases.map(mainMap)
  }
}

function load (stream: Subject<any>) {
  stream.next(ENV.generateData().toArray())
  Monitoring.renderRate.ping()
  setTimeout(function () { load(stream) }, ENV.timeout)
}

Cycle.run(main, {
  DOM: makeDOMDriver('#test-container'),
  databases: function () {
    const stream = subject()
    load(stream)
    return stream
  }
})
