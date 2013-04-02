var Element = require('./Element'),
    extend = require('../core/extend');

var StringSource = function(attr) {
  attr = attr || {
    bufferSize: 1
  };
  this.__super__(attr);
  this._str = attr.str;
  this._bufferSize = attr.bufferSize;
  this._index = 0;
};

var prototype = StringSource.prototype;

prototype.go = function() {
  // Assume one consumer for now.
  var consumer = this._consumers[0];
  var index = this._index,
      str = this._str;
  while (index < str.length) {
    var val = str.substring(index, index += this._bufferSize);
    consumer.consume(val, this);
  }
  consumer.consumeEOS(this);
};

module.exports = extend(StringSource, Element);
