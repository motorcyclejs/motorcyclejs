'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseTree = undefined;

var _most = require('most');

var _most2 = _interopRequireDefault(_most);

var _assign = require('fast.js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function combineVTreeStreams(vTree) {
  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return (0, _assign2.default)(vTree, { children: children });
}

function parseTree(vTree) {
  if (vTree.observe) {
    return vTree.flatMap(parseTree);
  } else if ('object' === (typeof vTree === 'undefined' ? 'undefined' : _typeof(vTree)) && Array.isArray(vTree.children) && vTree.children.length > 0) {
    return _most2.default.zip.apply(_most2.default, [combineVTreeStreams, _most2.default.just(vTree)].concat(_toConsumableArray(vTree.children.map(parseTree))));
  } else if ('object' === (typeof vTree === 'undefined' ? 'undefined' : _typeof(vTree))) {
    return _most2.default.just(vTree);
  } else {
    throw new Error('Unhandled tree value');
  }
}

exports.default = parseTree;
exports.parseTree = parseTree;