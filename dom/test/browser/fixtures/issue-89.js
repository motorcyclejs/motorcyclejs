'use strict';
let CycleDOM = require('../../../src');
let most = require('most');
let {h} = CycleDOM;

function myElement(content) {
  return most.just(content).map(content =>
    h('h3.myelementclass', content)
  );
}

function makeModelNumber$() {
  return most.merge(
    most.just(123).delay(50),
    most.just(456).delay(200)
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
