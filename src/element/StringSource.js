var element = require('./element'),
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
  var index = this._index,
      str = this._str;
  while (index < str.length) {
    var val = str.substring(index, index += this._bufferSize);
    this.produce([val]);
  }
  this.produceEOS(this);
};

module.exports = extend(StringSource, element);
