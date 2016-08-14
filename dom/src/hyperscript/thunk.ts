import { VNode, VNodeData, Thunk, ThunkData } from '../interfaces'

import { h } from './hyperscript'

/* tslint:disable:max-line-length */
export interface ThunkFn {
  <T1>(selector: string, key: string | number, render: (state1: T1) => VNode, state: T1): Thunk
  <T1, T2>(selector: string, key: string | number, render: (state1: T1, state2: T2) => VNode, state: T1, state2: T2): Thunk
  <T1, T2, T3>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3) => VNode, state: T1, state2: T2, state3: T3): Thunk
  <T1, T2, T3, T4>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4) => VNode, state: T1, state2: T2, state3: T3, state4: T4): Thunk
  <T1, T2, T3, T4, T5>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5): Thunk
  <T1, T2, T3, T4, T5, T6>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6): Thunk
  <T1, T2, T3, T4, T5, T6, T7>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7): Thunk
  <T1, T2, T3, T4, T5, T6, T7, T8>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8): Thunk
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8, state9: T9) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8, state9: T9): Thunk
  <T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(selector: string, key: string | number, render: (state1: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8, state9: T9, state10: T10) => VNode, state: T1, state2: T2, state3: T3, state4: T4, state5: T5, state6: T6, state7: T7, state8: T8, state9: T9, state10: T10): Thunk
  (selector: string, key: string | number, render: (...state: any[]) => VNode, ...state: any[]): Thunk
}
/* tslint:enable:max-line-length */

function copyToThunk (vNode: VNode, thunk: Thunk): void {
  thunk.elm = vNode.elm
  if (!vNode.data) {
    vNode.data = {}
  }
  vNode.data.fn = (thunk.data as VNodeData).fn
  vNode.data.args = thunk.data.args
  thunk.data = vNode.data as ThunkData
  thunk.children = vNode.children
  thunk.text = vNode.text
  thunk.elm = vNode.elm
}

function init (thunk: Thunk) {
  const cur = thunk.data;
  const vNode = cur.fn.apply(undefined, cur.args);
  copyToThunk(vNode, thunk);
}

function prepatch (oldVnode: VNode, thunk: Thunk): void {
  let old = oldVnode.data
  let cur = thunk.data
  let oldArgs = old ? old.args : []
  let args = cur.args
  if (old && old.fn !== cur.fn || oldArgs && oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(undefined, args), thunk)
  }
  for (let i = 0; i < args.length; ++i) {
    if (oldArgs && oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(undefined, args), thunk)
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}

export const thunk: ThunkFn = <ThunkFn>function thunk(selector: string,
                                                      key: string | number,
                                                      render: (...state: any[]) => VNode,
                                                      ...state: any[]): Thunk {
  return h(selector, {
    key,
    hook: { init, prepatch },
    fn: render,
    args: state
  }) as Thunk
}
