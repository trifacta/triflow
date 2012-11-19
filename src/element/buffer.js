triflow.element.buffer = (function() {
  var element = function(name, outputs, attr) {
    attr = attr || {};

    this._pausedConsumers = {};
    this._bufferSize = attr.bufferSize || 1000;
    this._buffer = Array(this._bufferSize);
    this._writeIndex = 0;
    this._readIndex = 0;
    this._recentRead = true;

    this.__super__(name, outputs, attr);
  };

  var prototype = element.prototype;

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

  return triflow_constructor(element, triflow.element.tupleElement);
})();

