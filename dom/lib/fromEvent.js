'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _most = require('most');

var _most2 = _interopRequireDefault(_most);

var _CompoundDisposable = require('most/lib/disposable/CompoundDisposable');

var _CompoundDisposable2 = _interopRequireDefault(_CompoundDisposable);

var _Disposable = require('most/lib/disposable/Disposable');

var _Disposable2 = _interopRequireDefault(_Disposable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createListener(_ref) {
  var element = _ref.element;
  var eventName = _ref.eventName;
  var handler = _ref.handler;
  var useCapture = _ref.useCapture;

  if (element.addEventListener) {
    element.addEventListener(eventName, handler, useCapture);
    return new _Disposable2.default(function removeEventListener() {
      element.removeEventListener(eventName, handler, useCapture);
    }, {});
  }
  throw new Error('No listener found');
}

function createEventListener(_ref2) {
  var element = _ref2.element;
  var eventName = _ref2.eventName;
  var handler = _ref2.handler;
  var useCapture = _ref2.useCapture;

  var disposables = new _CompoundDisposable2.default();

  var toStr = Object.prototype.toString;
  if (toStr.call(element) === '[object NodeList]' || toStr.call(element) === '[object HTMLCollection]') {
    for (var i = 0, len = element.length; i < len; i++) {
      disposables.disposables.push(createEventListener({
        element: element.item(i),
        eventName: eventName,
        handler: handler,
        useCapture: useCapture }));
    }
  } else if (element) {
    disposables.disposables.push(createListener({ element: element, eventName: eventName, handler: handler, useCapture: useCapture }));
  }
  return function () {
    disposables.dispose();
  };
}

function fromEvent(element, eventName) {
  var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  return _most2.default.create(function (add) {
    return createEventListener({
      element: element,
      eventName: eventName,
      handler: function handler() {
        add(arguments[0]);
      },
      useCapture: useCapture });
  });
}

exports.default = fromEvent;