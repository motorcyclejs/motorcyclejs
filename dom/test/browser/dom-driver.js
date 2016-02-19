'use strict';
/* global describe, it */
let assert = require('assert');
let {run} = require('@motorcycle/core');
let Fixture89 = require('./fixtures/issue-89');
let most = require('most');
let {h, svg, div, input, p, span, h2, h3, h4, select, option, makeDOMDriver} = require('../../src');

function createRenderTarget(id = null) {
  let element = document.createElement('div');
  element.className = 'cycletest';
  if (id) {
    element.id = id;
  }
  document.body.appendChild(element);
  return element;
}

describe('makeDOMDriver', function () {
  it('should accept a DOM element as input', function () {
    const element = createRenderTarget();
    assert.doesNotThrow(function () {
      makeDOMDriver(element);
    });
  });

  it('should accept a DocumentFragment as input', function () {
    const element = document.createDocumentFragment();
    assert.doesNotThrow(function () {
      makeDOMDriver(element);
    });
  });

  it('should accept a string selector to an existing element as input', function () {
    const id = 'testShouldAcceptSelectorToExisting';
    const element = createRenderTarget();
    element.id = id;
    assert.doesNotThrow(function () {
      makeDOMDriver('#' + id);
    });
  });

  it('should not accept a selector to an unknown element as input', function () {
    assert.throws(function () {
      makeDOMDriver('#nonsenseIdToNothing');
    }, /Given container is not a DOM element neither a selector string/);
  });

  it('should not accept a number as input', function () {
    assert.throws(function () {
      makeDOMDriver(123);
    }, /Given container is not a DOM element neither a selector string/);
  });
});

describe('DOM Driver', function () {
  it('should throw if input is not an Observable<VTree>', function () {
    const domDriver = makeDOMDriver(createRenderTarget());
    assert.throws(function () {
      domDriver({});
    }, /The DOM driver function expects as input an Observable of virtual/);
  });

  it('should have isolateSource() and isolateSink() in source', function (done) {
    function app() {
      return {
        DOM: most.just(div())
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    assert.strictEqual(typeof sources.DOM.isolateSource, 'function');
    assert.strictEqual(typeof sources.DOM.isolateSink, 'function');
    dispose();
    done();
  });
});
