var TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var BufferElement = module.exports = function(attr, outputs) {
  attr = attr || {};
  this._pausedConsumers = {};
  this._bufferSize = attr.bufferSize || 1000;
  this._buffer = Array(this._bufferSize);
  this._writeIndex = 0;
  this._readIndex = 0;
  this._recentRead = true;
  this.__super__(attr, outputs);
};

var prototype = BufferElement.prototype;

// Logic for pausing/resuming.
prototype.pausedConsumers = function() {
  return this._pausedConsumers;
};

prototype.buffer = function() {
  return this._buffer;
};

prototype.pauseConsumer = function(consumer) {
  this._pausedConsumers[consumer.elementId()] = 1;
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
  delete this._pausedConsumers[consumer.elementId()];
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

prototype.consumeEOS = function(source) {
  this._seenEOS = true;
  if (this.consumersReady()) {
    this.produceEOS();
  }
};

prototype.produceEOS = function() {
  if (this.consumersReady()) {
    TupleElement.prototype.produceEOS.call(this);
  }
};


prototype.clearBuffer = function() {
  var consumers = this._consumers, i;
  while (this.consumersReady() && !this.bufferEmpty()) {
    this.produce(this.readFromBuffer());
  }
  if (this._seenEOS) {
    this.produceEOS();
  }
};

prototype.bufferEmpty = function() {
  return (this._writeIndex === this._readIndex && this._recentRead === true);
};

prototype.bufferFull = function() {
  return (this._writeIndex === this._readIndex && this._recentRead === false);
};

prototype.writeToBuffer = function(data) {
  var writeIndex = this._writeIndex, readIndex = this._readIndex;
  if (this.bufferFull()) {
    throw new Error('Buffer is full.');
  }
  this._buffer[writeIndex] = data;
  if (writeIndex === this._bufferSize - 1) {
    this._writeIndex = 0;
  } else {
    ++this._writeIndex;
  }
  this._recentRead = false;
};

prototype.readFromBuffer = function() {
  var writeIndex = this._writeIndex, readIndex = this._readIndex;

  if (this.bufferEmpty()) {
    throw new Error('Buffer is empty.');
  }
  data = this._buffer[readIndex];

  if (readIndex === this._bufferSize - 1) {
    this._readIndex = 0;
  } else {
    ++this._readIndex;
  }
  this._recentRead = true;

  return data;
};

prototype.consume = function(data, source) {
  if (this.consumersReady() && this.bufferEmpty()) {
    this.produce(data);
  } else {
    this.writeToBuffer(data);
  }
};

extend(BufferElement, TupleElement);


