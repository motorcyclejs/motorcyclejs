'use strict';

var _Stream = require('most/lib/Stream');

var _Stream2 = _interopRequireDefault(_Stream);

var _MulticastSource = require('most/lib/source/MulticastSource');

var _MulticastSource2 = _interopRequireDefault(_MulticastSource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tryEvent = function tryEvent(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
};

var EventAdapter = function EventAdapter( // eslint-disable-line
init, event, source, useCapture, sink, scheduler) {
  this.event = event;
  this.source = source;
  this.useCapture = useCapture;

  var addEvent = function addEvent(ev) {
    tryEvent(scheduler.now(), ev, sink);
  };

  this._dispose = init(source, event, addEvent, useCapture);
};

EventAdapter.prototype.dispose = function dispose() {
  return this._dispose(this.event, this.source);
};

var initEventTarget = function initEventTarget(source, event, addEvent, useCapture) {
  // eslint-disable-line
  source.addEventListener(event, addEvent, useCapture);

  var dispose = function dispose(_event, target) {
    target.removeEventListener(_event, addEvent, useCapture);
  };

  return dispose;
};

function EventTargetSource(event, source, useCapture) {
  this.event = event;
  this.source = source;
  this.useCapture = useCapture;
}

EventTargetSource.prototype.run = function run(sink, scheduler) {
  return new EventAdapter(initEventTarget, this.event, this.source, this.useCapture, sink, scheduler);
};

var fromEvent = function fromEvent(event, source) {
  var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  var s = undefined;
  if (source.addEventListener && source.removeEventListener) {
    s = new _MulticastSource2.default(new EventTargetSource(event, source, useCapture));
  } else {
    throw new Error('source must support addEventListener/removeEventListener');
  }
  return new _Stream2.default(s);
};

module.exports = fromEvent;