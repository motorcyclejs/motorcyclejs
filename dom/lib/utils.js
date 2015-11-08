'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subject = exports.getDomElement = undefined;

var _most = require('most');

var _most2 = _interopRequireDefault(_most);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isElement(obj) {
  return typeof HTMLElement === 'object' ? obj instanceof HTMLElement || obj instanceof DocumentFragment : //DOM2
  obj && typeof obj === 'object' && obj !== null && (obj.nodeType === 1 || obj.nodeType === 11) && typeof obj.nodeName === 'string';
}

function getDomElement(_el) {
  var domElement = typeof _el === 'string' ? document.querySelector(_el) : _el;

  if (typeof domElement === 'string' && domElement === null) {
    throw new Error('Cannot render into unknown element `' + _el + '`');
  } else if (!isElement(domElement)) {
    throw new Error('Given container is not a DOM element neither a ' + 'selector string.');
  }
  return domElement;
}

function setImmediate(fn) {
  return setTimeout(fn, 0);
}

function Subject() {
  var initial = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

  var _add = undefined;
  var _end = undefined;
  var _error = undefined;

  var stream = _most2.default.create(function (add, end, error) {
    _add = add;
    _end = end;
    _error = error;
    return _error;
  });

  stream.push = function (v) {
    return setImmediate(function () {
      return typeof _add === 'function' ? _add(v) : void 0;
    });
  };

  stream.end = function () {
    return setImmediate(function () {
      return typeof _end === 'function' ? _end() : void 0;
    });
  };

  stream.error = function (e) {
    return setImmediate(function () {
      return typeof _error === 'function' ? _error(e) : void 0;
    });
  };

  stream.plug = function (value$) {
    var subject = Subject();
    value$.forEach(subject.push);
    subject.forEach(stream.push);
    return subject.end;
  };

  if (initial !== null) {
    stream.push(initial);
  }

  return stream;
}

exports.getDomElement = getDomElement;
exports.Subject = Subject;