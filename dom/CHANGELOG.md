# 11.0.0 (2017-06-22)
---

## Breaking Changes

1. Types from mostly-dom such as ElementVirutalNode and VirtualNode no longer exist.
  - feat(dom): upgrade to mostly-dom v3 [fcd5978f](https://github.com/motorcyclejs/dom/commits/fcd5978f7d2d6fbfab1657ab8c486c2bef05d38d)

## Features

- feat(dom): upgrade mostly-dom [f971b4a6](https://github.com/motorcyclejs/dom/commits/f971b4a6dd24866a56362b3f046f0dea4aa768f8)
- feat(dom): upgrade mostly-dom [b7be83e6](https://github.com/motorcyclejs/dom/commits/b7be83e62a082d06056a9b5413f897003bb6c1f4)

## Bug Fixes

- fix(vNodeWrapper): use VNodeProps [f210e532](https://github.com/motorcyclejs/dom/commits/f210e53213a25ab6a778149de89260b55805ee9a)
- fix(dom): fix compile errors [33529aeb](https://github.com/motorcyclejs/dom/commits/33529aeb1d110afe402a3a174e9766f2cb8c4d48)
- fix(vNodeWrapper): use VNodeProps [3577b965](https://github.com/motorcyclejs/dom/commits/3577b965cb5ecfaa6150f8c476d57c24830a81a3)
- fix(dom): fix compile errors [ecd9708a](https://github.com/motorcyclejs/dom/commits/ecd9708af44cf20b2ac64867ceb7f8b6fa551b06)

# 10.4.0 (2017-05-02)
---

## Features

- feat(dom): add 1 parameter variants of event functions [4ea69fad](https://github.com/motorcyclejs/dom/commits/4ea69fad5ca09aee90dee771a593bd09fd0272f0)

# 10.3.0 (2017-05-01)
---

## Bug Fixes

- fix(dom): upgrade dependencies [1fb4dfc4](https://github.com/motorcyclejs/dom/commits/1fb4dfc4fa3065741daf7c6c7ca3980e3ab5023f)

# 10.2.0 (2017-04-29)
---

## Features

- feat(dom): upgrade to TS 2.3.x [a8a9b6b0](https://github.com/motorcyclejs/dom/commits/a8a9b6b0f526269315aae91edd02e7b67a2cca7d)

## Bug Fixes

- fix(dom): fix compilation error [9bf645aa](https://github.com/motorcyclejs/dom/commits/9bf645aa58da3892112a74290778e13aa7a1cabb)

# 10.1.0 (2017-04-12)
---

## Bug Fixes

- fix(MotorcycleDomSource): set correct currentTarget when using useCapture [2ae6a1be](https://github.com/motorcyclejs/dom/commits/2ae6a1bebf203ec6a404e2fcb0b5274434e7c749)

# 10.0.0 (2017-04-12)
---

## Breaking Changes

1. generate scope when calling isolateDom
  - fix(isolateDom): generate scope key before calling component [102437e4](https://github.com/motorcyclejs/dom/commits/102437e47ea3f6ff9f6064f9baf77bd83bb972d0)

# 9.2.0 (2017-04-10)
---

## Bug Fixes

- fix(MotorcycleDomSource): useCapture should capture *all* child events [c2d0831f](https://github.com/motorcyclejs/dom/commits/c2d0831f4c865705e22d4543412a2cdc6ce11cde)

# 9.1.0 (2017-03-14)
---

## Bug Fixes

- fix(dom): fix isolateDom key error [40235d07](https://github.com/motorcyclejs/dom/commits/40235d07955475d073bd21a24d8e77432d99e007)

# 9.0.0 (2017-03-14)
---

## Features

- feat(dom): add isolateDom helper function [074a52f9](https://github.com/motorcyclejs/dom/commits/074a52f9ade73e132c0a6ccafd87e15768a5f45d)
- feat(types): remove type restrictions on Sources and Sinks [2429a4ca](https://github.com/motorcyclejs/dom/commits/2429a4ca4329631085f53c4f03e629387b8339e5)
- feat(dom): remove mockDomSource [e59d778b](https://github.com/motorcyclejs/dom/commits/e59d778ba108312a7662b89cd86f342937c3cf83)
- feat(META): upgrade to latest devdependencies [42d7ae52](https://github.com/motorcyclejs/dom/commits/42d7ae5276d8e585748f07532c0ab92c99160eee)

# 8.4.0 (2017-03-03)
---

## Bug Fixes

- fix(dom): update mostly-dom [4bef23ec](https://github.com/motorcyclejs/dom/commits/4bef23ec3a3526b8c8cc58c622942e5e788512ac)

# 8.3.0 (2017-03-01)
---

## Bug Fixes

- fix(META): update and remove all yarn.lock files from npm [11fd8409](https://github.com/motorcyclejs/dom/commits/11fd8409244fc85df82d004f3f42f8f78f4b65c2)

# 8.2.0 (2017-02-28)
---

## Bug Fixes

- fix(dom): ensure target exists [d6cd75e8](https://github.com/motorcyclejs/dom/commits/d6cd75e8c2272689f0c85b1958327456f9b90cf8)

# 8.1.0 (2017-02-22)
---

## Bug Fixes

- fix(dom): update mostly-dom [9be9a128](https://github.com/motorcyclejs/dom/commits/9be9a128797b9101b0f75bf440def5e3e0e5bfb1)

# 8.0.0 (2017-02-14)
---

## Breaking Changes

1. replace driver function with component function
  - feat(dom): move from driver function to component function [3efeff45](https://github.com/motorcyclejs/dom/commits/3efeff45759019c2b13c62e482a8b88bb973935f)

# 7.0.6 (2017-01-19)
---

## Bug Fixes

- fix(dom): update to latest dependencies [ba91b214](https://github.com/motorcyclejs/dom/commits/ba91b214d696cb3d498cafab804c01749cce4f8e)

# 7.0.5 (2017-01-05)
---

## Bug Fixes

- fix(deploy): ensure all packages a being built before releasing [247fac3e](https://github.com/motorcyclejs/dom/commits/247fac3ecbc1110343a0c48ee6c9fe1cad0b95d7)

# 7.0.4 (2017-01-05)
---

## Bug Fixes

- fix(deploy): ensure all packages a being built before releasing [247fac3e](https://github.com/motorcyclejs/dom/commits/247fac3ecbc1110343a0c48ee6c9fe1cad0b95d7)

# 7.0.3 (2017-01-05)
---

## Bug Fixes

- fix(dom): add files field [d2b19fd6](https://github.com/motorcyclejs/dom/commits/d2b19fd626e7d25f293f916c1bc2bf3cff9a88d4)

# 7.0.2 (2017-01-04)
---

## Bug Fixes

- fix(dom): update tsconfig [660d4d61](https://github.com/motorcyclejs/dom/commits/660d4d611fd7afb848b40ebcca8d57130b5b604f)

# 7.0.1 (2017-01-03)
---

## Bug Fixes

- fix(META): fix npmignoring [adee7dfe](https://github.com/motorcyclejs/dom/commits/adee7dfeaf56820919d290194dd2a575a1b2ff03)

# 7.0.0 (2017-01-03)
---

## Features

- feat(dom): remove dependency on @motorcycle/core [bf7c2314](https://github.com/motorcyclejs/dom/commits/bf7c231459f864acaf23d6806408adb08ddd758f)
- feat(dom): reimplement on top of mostly-dom [09e79e57](https://github.com/motorcyclejs/dom/commits/09e79e57dbf64e96b5aa9e2f781c0c93ab9231ef)

<a name="6.7.0"></a>
# [6.7.0](https://github.com/motorcyclejs/dom/compare/v6.6.0...v6.7.0) (2016-12-21)


### Bug Fixes

* **MotorcycleDomSource:** fix selecting of elements with no prior select() ([#121](https://github.com/motorcyclejs/dom/issues/121)) ([f548609](https://github.com/motorcyclejs/dom/commit/f548609))



<a name="6.6.0"></a>
# [6.6.0](https://github.com/motorcyclejs/dom/compare/v6.5.0...v6.6.0) (2016-12-20)


### Bug Fixes

* **MotorcycleDomSource:** correctly simulate events ([#118](https://github.com/motorcyclejs/dom/issues/118)) ([9bd15be](https://github.com/motorcyclejs/dom/commit/9bd15be))



<a name="6.5.0"></a>
# [6.5.0](https://github.com/motorcyclejs/dom/compare/v6.4.0...v6.5.0) (2016-12-20)


### Bug Fixes

* **events:** fix event delegation ([#117](https://github.com/motorcyclejs/dom/issues/117)) ([10f6fb4](https://github.com/motorcyclejs/dom/commit/10f6fb4))



<a name="6.4.0"></a>
# [6.4.0](https://github.com/motorcyclejs/dom/compare/v6.3.0...v6.4.0) (2016-12-20)


### Features

* **api-wrappers:** implement functional api wrappers for DomSource ([9ad262b](https://github.com/motorcyclejs/dom/commit/9ad262b))



<a name="6.3.0"></a>
# [6.3.0](https://github.com/motorcyclejs/dom/compare/v6.2.0...v6.3.0) (2016-12-20)


### Features

* **hasCssSelector:** implement hasCssSelector function ([05cc55f](https://github.com/motorcyclejs/dom/commit/05cc55f))



<a name="6.2.0"></a>
# [6.2.0](https://github.com/motorcyclejs/dom/compare/v6.1.0...v6.2.0) (2016-12-14)


### Bug Fixes

* **virtual-dom:** fix test node patching errors ([#110](https://github.com/motorcyclejs/dom/issues/110)) ([68f1a41](https://github.com/motorcyclejs/dom/commit/68f1a41))



<a name="6.1.0"></a>
# [6.1.0](https://github.com/motorcyclejs/dom/compare/v6.0.0...v6.1.0) (2016-12-13)


### Bug Fixes

* **hyperscript:** include missing img tag ([3cd90fb](https://github.com/motorcyclejs/dom/commit/3cd90fb))



<a name="6.0.0"></a>
# [6.0.0](https://github.com/motorcyclejs/dom/compare/v5.0.0...v6.0.0) (2016-12-09)


### Features

* **dom:** complete reimplementation of dom driver on top of snabbdom fork ([#108](https://github.com/motorcyclejs/dom/issues/108)) ([2ae7b8b](https://github.com/motorcyclejs/dom/commit/2ae7b8b))


### BREAKING CHANGES

* dom: VNode shape no longer has .sel, but .tagName, .className, and .id.
Events are no longer mutated to point to a different currentTarget.
Parent elements will receive non-bubbling events originating from child elements.



<a name="5.0.0"></a>
# [5.0.0](https://github.com/motorcyclejs/dom/compare/v4.2.0...v5.0.0) (2016-12-01)


### Bug Fixes

* **MainDomSource:** fix incorrect usage of `this` ([cfb6eed](https://github.com/motorcyclejs/dom/commit/cfb6eed))


### Features

* **driver:** remove transposition and refactor ([c04bf15](https://github.com/motorcyclejs/dom/commit/c04bf15))
* **makeHTMLDriver:** remove html driver ([91aaa92](https://github.com/motorcyclejs/dom/commit/91aaa92))


### BREAKING CHANGES

* driver: removed transposition, remove makeHTMLDriver entirely. Rename
makeDOMDriver to makeDomDriver.



<a name="4.2.0"></a>
# [4.2.0](https://github.com/motorcyclejs/dom/compare/v4.1.0...v4.2.0) (2016-11-19)


### Bug Fixes

* **EventDelegator:** fix obscure cases where events are passed multiple times ([f2171e6](https://github.com/motorcyclejs/dom/commit/f2171e6))
* **EventDelegator:** make destination to mimic bubbling ([75ae10e](https://github.com/motorcyclejs/dom/commit/75ae10e))
* **EventDelegator:** make sure destinations match ([f64a63b](https://github.com/motorcyclejs/dom/commit/f64a63b))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/motorcyclejs/dom/compare/v4.0.0...v4.1.0) (2016-11-19)


### Bug Fixes

* **events:** fix subtle bug ([c909727](https://github.com/motorcyclejs/dom/commit/c909727))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/motorcyclejs/dom/compare/v3.3.0...v4.0.0) (2016-11-19)


### Features

* **classes:** use classes module to avoid extra rerendering ([15bc632](https://github.com/motorcyclejs/dom/commit/15bc632))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/motorcyclejs/dom/compare/v3.2.0...v3.3.0) (2016-11-17)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/motorcyclejs/dom/compare/v3.1.0...v3.2.0) (2016-11-16)


### Bug Fixes

* **ElementFinder:** use local matchesSelector function ([8d4085a](https://github.com/motorcyclejs/dom/commit/8d4085a))
* **EventDelegator:** update to use local matchesSelector ([b381c35](https://github.com/motorcyclejs/dom/commit/b381c35))


### Features

* **DOMSource:** add document window and body dom sources ([c989dfa](https://github.com/motorcyclejs/dom/commit/c989dfa))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/motorcyclejs/dom/compare/v3.0.0...v3.1.0) (2016-11-14)


### Bug Fixes

* **dom:** fix errors around most.js Stream instances ([1a2ae9d](https://github.com/motorcyclejs/dom/commit/1a2ae9d))
* **DOM:** fix for failing tests ([b32fe5e](https://github.com/motorcyclejs/dom/commit/b32fe5e))


### Features

* **DOMSource:** have interface for DOMSource for other sources to implement ([8a428f2](https://github.com/motorcyclejs/dom/commit/8a428f2))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/motorcyclejs/dom/compare/v2.0.1...v3.0.0) (2016-08-14)


### Features

* **dom:** rewrite in TypeScript ([baa2588](https://github.com/motorcyclejs/dom/commit/baa2588))


### BREAKING CHANGES

* dom:   before: DOMSource.elements -> Stream<HTMLElement | HTMLElement[]>

  after: DOMSource.elements() -> Stream<HTMLElement | HTMLElement[]>



<a name="2.0.1"></a>
## [2.0.1](https://github.com/motorcyclejs/dom/compare/v2.0.0...v2.0.1) (2016-06-14)


### Bug Fixes

* **DOMSource:** fix typo in dispose ([c39dad9](https://github.com/motorcyclejs/dom/commit/c39dad9))
* **isolate:** fix isolate import in tests ([90505a7](https://github.com/motorcyclejs/dom/commit/90505a7))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/motorcyclejs/dom/compare/v1.4.0...v2.0.0) (2016-05-17)


### Reverts

* **release:** undo poorly done release ([29a8e9c](https://github.com/motorcyclejs/dom/commit/29a8e9c))
* **release:** undo poorly done release v2 ([e857fb0](https://github.com/motorcyclejs/dom/commit/e857fb0))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/motorcyclejs/dom/compare/v1.3.0...v1.4.0) (2016-03-30)


### Bug Fixes

* dataset module has not yet been publised to npm ([07e4b47](https://github.com/motorcyclejs/dom/commit/07e4b47))
* **issue-89:** hopefully help fix fiddly test ([2eb6afb](https://github.com/motorcyclejs/dom/commit/2eb6afb))


### Features

* **mockDOMSource:** update to allow for multiple .select()s ([9a47a30](https://github.com/motorcyclejs/dom/commit/9a47a30))
* **modules:** remove local version of modules in favor of fixed snabbdom versions ([c1864b2](https://github.com/motorcyclejs/dom/commit/c1864b2))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/motorcyclejs/dom/compare/v1.2.1...v1.3.0) (2016-03-15)


### Features

* add new event types that don't bubble ([e62092e](https://github.com/motorcyclejs/dom/commit/e62092e))
* **makeDOMDriver:** add option to specify your own error handling function ([80717f8](https://github.com/motorcyclejs/dom/commit/80717f8))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/motorcyclejs/dom/compare/v1.2.0...v1.2.1) (2016-02-23)


### Bug Fixes

* **select:** adjust select() semantics to match more css selectors properly ([362cab6](https://github.com/motorcyclejs/dom/commit/362cab6)), closes [#80](https://github.com/motorcyclejs/dom/issues/80)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/motorcyclejs/dom/compare/v1.1.0...v1.2.0) (2016-02-19)


### Bug Fixes

* fix all failing tests of new test suite ([7107cb8](https://github.com/motorcyclejs/dom/commit/7107cb8))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/motorcyclejs/dom/compare/v1.0.3...v1.1.0) (2016-02-07)


### Features

* update event-delegation model ([2543bea](https://github.com/motorcyclejs/dom/commit/2543bea)), closes [#68](https://github.com/motorcyclejs/dom/issues/68)
* **events:** use [@most](https://github.com/most)/dom-event instead of local fromEvent ([daec57d](https://github.com/motorcyclejs/dom/commit/daec57d)), closes [#69](https://github.com/motorcyclejs/dom/issues/69)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/motorcyclejs/dom/compare/v1.0.2...v1.0.3) (2015-12-30)



<a name="1.0.2"></a>
## [1.0.2](https://github.com/motorcyclejs/dom/compare/v1.0.1...v1.0.2) (2015-12-30)


### Bug Fixes

* polyfill raf for snabbom ([eb17a5d](https://github.com/motorcyclejs/dom/commit/eb17a5d))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/motorcyclejs/dom/compare/v1.0.0...v1.0.1) (2015-12-30)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/motorcyclejs/dom/compare/v0.7.0...v1.0.0) (2015-12-30)


### Bug Fixes

* fix makeDomDriver import ([1f6347c](https://github.com/motorcyclejs/dom/commit/1f6347c))
* remove unneeded test ([aef055d](https://github.com/motorcyclejs/dom/commit/aef055d))
* rename `sink.type` to `sink.event` ([34d9705](https://github.com/motorcyclejs/dom/commit/34d9705))
* **events:** use standard event.target ([5c8b231](https://github.com/motorcyclejs/dom/commit/5c8b231))
* **isolate:** update isolation semantics ([08b69f0](https://github.com/motorcyclejs/dom/commit/08b69f0))
* **select:** fix isolateSource and isolateSink ([06bb35d](https://github.com/motorcyclejs/dom/commit/06bb35d))
* **test:** fix usage errors ([4537205](https://github.com/motorcyclejs/dom/commit/4537205))
* **test:** remove unused sinon import ([7a34933](https://github.com/motorcyclejs/dom/commit/7a34933))
* **thunks:** check for data.vnode ([21e5f57](https://github.com/motorcyclejs/dom/commit/21e5f57))
* **vTreeParser:** ignore previous child observable's value ([b788e88](https://github.com/motorcyclejs/dom/commit/b788e88)), closes [#46](https://github.com/motorcyclejs/dom/issues/46)


### Code Refactoring

* change `makeDomDriver` to `makeDOMDriver` ([b30c209](https://github.com/motorcyclejs/dom/commit/b30c209)), closes [#51](https://github.com/motorcyclejs/dom/issues/51)


### Features

* **dom-driver:** reuse event listeners ([1a93973](https://github.com/motorcyclejs/dom/commit/1a93973))
* **events:** avoid recreating the same eventListener ([56cad78](https://github.com/motorcyclejs/dom/commit/56cad78))
* **events:** Switch to event delegation ([4c9ff0f](https://github.com/motorcyclejs/dom/commit/4c9ff0f))
* **fromEvent:** handle single DOM Nodes ([a8bd6fa](https://github.com/motorcyclejs/dom/commit/a8bd6fa))
* **isolate:** add multicast ([db6c6f4](https://github.com/motorcyclejs/dom/commit/db6c6f4))
* **makeDOMDriver:** pass a stream of the rootElem to makeElementSelector ([17cb9d9](https://github.com/motorcyclejs/dom/commit/17cb9d9))
* **makeDOMDriver:** switch to options object ([33fc153](https://github.com/motorcyclejs/dom/commit/33fc153)), closes [#57](https://github.com/motorcyclejs/dom/issues/57)
* **makeDOMDriver:** throw error if modules is not an array ([11f2e35](https://github.com/motorcyclejs/dom/commit/11f2e35))
* **select:** rewrite DOM.select with snabbdom-selector ([8b231e4](https://github.com/motorcyclejs/dom/commit/8b231e4))
* **select:** use event delegation ([770541e](https://github.com/motorcyclejs/dom/commit/770541e))
* **thunk:** export thunk by default ([2e43834](https://github.com/motorcyclejs/dom/commit/2e43834))
* **vTreeParser:** Add support for a static vTree option ([89e2ba1](https://github.com/motorcyclejs/dom/commit/89e2ba1)), closes [#59](https://github.com/motorcyclejs/dom/issues/59)
* **wrapVnode:** wrap top-evel vnode ([dbbca44](https://github.com/motorcyclejs/dom/commit/dbbca44)), closes [#8](https://github.com/motorcyclejs/dom/issues/8)


### BREAKING CHANGES

*   before:
    import {makeDomDriver} from '@motorcycle/dom'

  after:
    import {makeDOMDriver} from '@motorcyce/core'
* wrapVnode:   Before:
    Patching: h('h1', {}, 'Hello')
    to: <div id='example'></div>
    rendered: <h1>Hello</h1>

  After:
   Patching: h('h1', {}, 'Hello')
   to: <div id='example'></div>
   renders: <div id='example><h1>Hello</h1></div>
* select:   Before:
    DOM.select(selector) used document.querySelector() under the hood
    for ease of use and for it's substanstially more robust css selector
    engine.

  After:
    DOM.selector(selector) now uses snabbdom-selector to match css selectors
    from the virtual DOM tree for the speed of avoiding the baggage of the DOM.

References #4



<a name="0.7.0"></a>
# [0.7.0](https://github.com/motorcyclejs/dom/compare/v0.6.1...v0.7.0) (2015-12-11)


### Bug Fixes

* **isolate:** fix adding of rendundant className ([e78e90f](https://github.com/motorcyclejs/dom/commit/e78e90f))
* **node:** Fix importing on node ([a843791](https://github.com/motorcyclejs/dom/commit/a843791)), closes [#21](https://github.com/motorcyclejs/dom/issues/21)
* **rootElem$:** revert rootElem$ to previous behavior ([09704ce](https://github.com/motorcyclejs/dom/commit/09704ce))


### Features

* assume NodeList ([503652d](https://github.com/motorcyclejs/dom/commit/503652d)), closes [#17](https://github.com/motorcyclejs/dom/issues/17)
* use new fromEvent() semantics ([99be9d2](https://github.com/motorcyclejs/dom/commit/99be9d2)), closes [#17](https://github.com/motorcyclejs/dom/issues/17)
* **fromEvent:** add check for NodeList ([0801233](https://github.com/motorcyclejs/dom/commit/0801233))


### Performance Improvements

* Remove Array.prototype.slice.call ([31ad84f](https://github.com/motorcyclejs/dom/commit/31ad84f))
* **isolate:** remove unneeded .trim() ([2f31c85](https://github.com/motorcyclejs/dom/commit/2f31c85))



<a name="0.6.1"></a>
## [0.6.1](https://github.com/motorcyclejs/dom/compare/v0.6.0...v0.6.1) (2015-11-22)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/motorcyclejs/dom/compare/v0.5.2...v0.6.0) (2015-11-22)



<a name="0.5.2"></a>
## [0.5.2](https://github.com/motorcyclejs/dom/compare/v0.5.1...v0.5.2) (2015-11-20)



<a name="0.5.1"></a>
## [0.5.1](https://github.com/motorcyclejs/dom/compare/v0.5.0...v0.5.1) (2015-11-20)


### Features

* **auto-scope:** Implement auto-scoping ([6d5d9cd](https://github.com/motorcyclejs/dom/commit/6d5d9cd))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/motorcyclejs/dom/compare/v0.4.1...v0.5.0) (2015-11-16)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/motorcyclejs/dom/compare/v0.4.0...v0.4.1) (2015-11-14)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/motorcyclejs/dom/compare/v0.3.2...v0.4.0) (2015-11-13)



<a name="0.3.2"></a>
## [0.3.2](https://github.com/motorcyclejs/dom/compare/v0.3.1...v0.3.2) (2015-11-11)



<a name="0.3.1"></a>
## [0.3.1](https://github.com/motorcyclejs/dom/compare/v0.3.0...v0.3.1) (2015-11-11)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/motorcyclejs/dom/compare/v0.2.0...v0.3.0) (2015-11-11)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/motorcyclejs/dom/compare/v0.1.5...v0.2.0) (2015-11-11)



<a name="0.1.5"></a>
## [0.1.5](https://github.com/motorcyclejs/dom/compare/v0.1.4...v0.1.5) (2015-11-10)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/motorcyclejs/dom/compare/v0.1.3...v0.1.4) (2015-11-10)



<a name="0.1.3"></a>
## [0.1.3](https://github.com/motorcyclejs/dom/compare/v0.1.2...v0.1.3) (2015-11-09)



<a name="0.1.2"></a>
## [0.1.2](https://github.com/motorcyclejs/dom/compare/v0.1.1...v0.1.2) (2015-11-09)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/motorcyclejs/dom/compare/v0.1.0...v0.1.1) (2015-11-09)



<a name="0.1.0"></a>
# 0.1.0 (2015-11-01)


