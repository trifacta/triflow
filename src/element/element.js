//= require _package.js

triflow.element.element = (function() {
  var element = function(name, attr) {
    attr = attr || {};

    this._name = name;
    this._attr = attr;
    this._producers = [];
    this._consumers = [];
    this._seenEOS = false;
    this._pausedConsumers = {};
    this._buffer = [];
  };

  var prototype = element.prototype;

  prototype.name = function(consumer) {
    return this._name;
  };

  prototype.attr = function(key) {
    return this._attr[key];
  };

  prototype.pausedConsumers = function() {
    return this._pausedConsumers;
  };

  prototype.buffer = function() {
    return this._buffer;
  };

  prototype.consumeEOS = function(source) {
    this._seenEOS = true;
    if (this.consumersReady()) {
      this.produceEOS();
    }
  };

  prototype.produceEOS = function() {
    if (this.consumersReady() && this.bufferEmpty()) {
      var consumers = this._consumers, i;
      for (i = 0; i < consumers.length; ++i) {
        consumers[i].consumeEOS(this);
      }
    }
  };

  prototype.produce = function(data) {
    var consumers = this._consumers, i;

    for (i = 0; i < consumers.length; ++i) {
      consumers[i].consume(data, this);
    }
  };

  prototype.consume = function(data, source) {
    this.produce(data);
  };

  // Logic for pausing/resuming.
  prototype.pauseConsumer = function(consumer) {
    this._pausedConsumers[consumer.name()] = 1;
  };

  prototype.consumersReady = function() {
    for (var i in this._pausedConsumers) { return false;}
    return true;
  };

  prototype.bufferEmpty = function() {
    return (this._buffer.length === 0);
  };

  prototype.bufferFull = function() {
    return (this._buffer.length);
  };

  prototype.continueConsumer = function(consumer) {
    delete this._pausedConsumers[consumer.name()];
    if (this.consumersReady()) {
      this.clearBuffer();
    }
  };

  prototype.clearBuffer = function() {
    var data = this._buffer[0];

    this._buffer = [];
    if (data) {this.produce(data);}

    if (this._seenEOS) {
      this.produceEOS();
    }
  };
  // End logic for pausing/resuming.

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
    this._consumers = elements.slice();
    elements.forEach(function(e) {
      e.producers().push(this);
    }, this);
  };

  return triflow_constructor(element);
})();

