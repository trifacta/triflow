var _ = require('underscore'),
    mixin = require('../core/index').mixin,
    events = require('events');

var Element = module.exports = function(attr) {
  events.EventEmitter.call(this);
  attr = attr || {};
  this._attr = attr;
  this._producers = [];
  this._consumers = [];
  this._activeConsumers = [];
  this._seenEOS = false;
  this._producedEOS = false;
  this._elementId = attr.elementId;
};

var prototype = Element.prototype;

prototype.elementId = function() {
  return this._elementId;
};

prototype.attr = function(key) {
  return this._attr[key];
};

prototype.consumeEOS = function(source) {
  this._seenEOS = true;
  this.produceEOS();
};

prototype.produceEOS = function() {
  if (!this._producedEOS) {
    var consumers = this._activeConsumers, i;
    for (i = 0; i < consumers.length; ++i) {
      consumers[i].consumeEOS(this);
    }
    this._producedEOS = true;
    this.emit('done');
  }
};

prototype.activeConsumers = function() {
  return this._activeConsumers;
};

prototype.stopConsumer = function(consumer) {
  this._activeConsumers.splice(this._activeConsumers.indexOf(consumer), 1);
  consumer.consumeEOS(this);
};

prototype.produce = function(data) {
  var consumers = this._activeConsumers, i;

  for (i = 0; i < consumers.length; ++i) {
    consumers[i].consume(data, this);
  }
};

prototype.consume = function(data, source) {
  this.produce(data);
};

prototype.producers = function() {
  return this._producers;
};

prototype.consumers = function() {
  return this._consumers;
};

prototype.wire = function(elements) {
  if (!_.isArray(elements)) {
    elements = [elements];
  }
  this._consumers = this._consumers || [];
  this._consumers = this._consumers.concat(elements);
  this._activeConsumers = this._activeConsumers.concat(elements);
  elements.forEach(function(e) {
    e.producers().push(this);
  }, this);
};

prototype.addConsumer = prototype.wire;

mixin(Element, events.EventEmitter);

