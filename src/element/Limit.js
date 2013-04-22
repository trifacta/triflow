var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var Limit = function(attr, outputs) {
  attr = attr || {};
  _.defaults(attr, {
    maxBytes: null,
    maxRecords: null
  });
  this.__super__(attr, outputs);
  this._maxBytes = attr.maxBytes;
  this._maxRecords = attr.maxRecords;
  this._numBytes = 0;
  this._numRecords = 0;
};

var prototype = Limit.prototype;

prototype.consume = function(data, source) {
  var stop = false;
  if (this._maxRecords) {
    if (++this._numRecords > this._maxRecords) {
      stop = true;
    }
  }
  // For maxBytes, assume all data is one-attribute string tuple.
  if (this._maxBytes) {
    assert(data.length === 1);
    assert(typeof data[0] === 'string');
    var str = data[0];
    this._numBytes += str.length;
    if (this._numBytes > this._maxBytes) {
      // Output whatever is less than numBytes.
      // console.log(this._numBytes, this._maxBytes)
      var remainingBytes = Math.floor((
          this._maxBytes - (this._numBytes - str.length)));
      this.produce([str.substring(0, remainingBytes)]);
      stop = true;
    }
  }
  if (stop) {
    source.stopConsumer(this);
  } else {
    this.produce(data);
  }
};

module.exports = extend(Limit, TupleElement);
