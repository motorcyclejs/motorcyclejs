'use strict';
let Cycle = require('@motorcycle/core').default;
let CycleDOM = require('../../../src/index');
let most = require('most');
let {h} = CycleDOM;

function myElement(content) {
  return most.of(content).map(content =>
    h('h3.myelementclass', content)
  );
}

function makeModelNumber$() {
  return most.merge(
    most.of(123).delay(50),
    most.of(456).delay(100)
  );
}

function viewWithContainerFn(number$) {
  return number$.map(number =>
    h('div', [
      myElement(String(number))
    ])
  );
}

function viewWithoutContainerFn(number$) {
  return number$.map(number =>
    myElement(String(number))
  );
}

module.exports = {
  myElement,
  makeModelNumber$,
  viewWithContainerFn,
  viewWithoutContainerFn
};
