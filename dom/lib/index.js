'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = exports.makeDOMDriver = undefined;

var _most = require('most');

var _most2 = _interopRequireDefault(_most);

var _snabbdom = require('snabbdom');

var _snabbdom2 = _interopRequireDefault(_snabbdom);

var _h = require('snabbdom/h');

var _h2 = _interopRequireDefault(_h);

var _utils = require('./utils');

var _fromEvent = require('./fromEvent');

var _fromEvent2 = _interopRequireDefault(_fromEvent);

var _parseTree = require('./parseTree');

var _parseTree2 = _interopRequireDefault(_parseTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function makeEventsSelector(element$) {
  return function events(eventName) {
    var useCapture = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (typeof eventName !== 'string') {
      throw new Error('DOM driver\'s events() expects argument to be a ' + 'string representing the event type to listen for.');
    }
    return element$.flatMap(function (element) {
      if (!element) {
        return _most2.default.empty();
      }
      return (0, _fromEvent2.default)(element, eventName, useCapture);
    });
  };
}

function makeElementSelector(rootElem$) {
  return function select(selector) {
    if (typeof selector !== 'string') {
      throw new Error('DOM driver\'s select() expects first argument to be a ' + 'string as a CSS selector');
    }
    var element$ = selector.trim() === ':root' ? rootElem$ : rootElem$.map(function (rootElem) {
      return rootElem.querySelectorAll(selector);
    });
    return {
      observable: element$,
      events: makeEventsSelector(element$)
    };
  };
}

function validateDOMDriverInput(view$) {
  if (!view$ || typeof view$.observe !== 'function') {
    throw new Error('The DOM driver function expects as input an ' + 'Observable of virtual DOM elements');
  }
}

function makeDOMDriver(container) {
  var modules = arguments.length <= 1 || arguments[1] === undefined ? [require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/attributes'), require('snabbdom/modules/style')] : arguments[1];

  var patch = _snabbdom2.default.init(modules);
  var rootElem = (0, _utils.getDomElement)(container);
  var renderContainer = document.createElement('div');
  var rootElem$ = (0, _utils.Subject)();

  return function DOMDriver(view$) {
    validateDOMDriverInput(view$);

    view$.flatMap(_parseTree2.default).loop(function (buffer, x) {
      buffer.push(x);
      if (buffer[0] === rootElem) {
        if (rootElem.hasChildNodes()) {
          rootElem.innerHTML = '';
        }
        rootElem.appendChild(renderContainer);
        buffer.shift();
      }

      var pair = buffer.slice(-2);
      patch.apply(undefined, _toConsumableArray(pair));
      console.log(pair);
      return pair;
    }, [rootElem, renderContainer]).forEach(console.log.bind(console));

    rootElem$.plug(view$.map(function () {
      return rootElem;
    }));

    return {
      select: makeElementSelector(rootElem$)
    };
  };
}

exports.makeDOMDriver = makeDOMDriver;
exports.h = _h2.default;