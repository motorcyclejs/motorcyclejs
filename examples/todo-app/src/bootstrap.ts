import { Infrastructure, makeApplication } from './application'
import { Sinks, Sources, TodoApp } from './ui/TodoApp'

import { LocalStorageTodoRepository } from './infrastructure'
import { makeDomComponent } from '@motorcycle/dom'
import { run } from '@motorcycle/run'

const rootElement = document.querySelector('#app-container') as HTMLDivElement

const Dom = makeDomComponent(rootElement)

const infrastructure: Infrastructure =
  {
    TodoRepository: LocalStorageTodoRepository,
  }

const Application = makeApplication(infrastructure)

run<Sources, Sinks>(TodoApp, (sinks) => ({ ...Dom(sinks), ...Application(sinks) }))
