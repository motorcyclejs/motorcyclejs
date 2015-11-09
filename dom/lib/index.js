'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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

var _map = require('fast.js/array/map');

var _map2 = _interopRequireDefault(_map);

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
      return _most2.default.merge.apply(_most2.default, _toConsumableArray((0, _map2.default)(element, function (el) {
        return (0, _fromEvent2.default)(eventName, el, useCapture).takeUntil(element$.skip(1).skipRepeats());
      })));
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

function firstRender(rootElem, renderContainer) {
  if (rootElem.hasChildNodes) {
    rootElem.innerHTML = '';
  }
  rootElem.appendChild(renderContainer);
  return rootElem;
}

function makeDOMDriver(container) {
  var modules = arguments.length <= 1 || arguments[1] === undefined ? [require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/attributes'), require('snabbdom/modules/style')] : arguments[1];

  var patch = _snabbdom2.default.init(modules);
  var rootElem = (0, _utils.getDomElement)(container);
  var renderContainer = document.createElement('div');

  return function DOMDriver(view$) {
    validateDOMDriverInput(view$);
    var rootElem$ = _most2.default.create(function (add) {
      view$.flatMap(_parseTree2.default).reduce(function (buffer, x) {
        var _buffer = _slicedToArray(buffer, 2);

        var viewContainer = _buffer[0];
        var view = _buffer[1];

        add(viewContainer === rootElem ? firstRender(viewContainer, view) : view.elm);
        patch(view, x);
        return [view, x];
      }, [rootElem, renderContainer]);
    });

    return {
      select: makeElementSelector(rootElem$.skipRepeats())
    };
  };
}

exports.makeDOMDriver = makeDOMDriver;
exports.h = _h2.default;