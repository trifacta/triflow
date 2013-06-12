var element = require('./Element'),
    extend = require('../core/extend'),
    fs = require('fs');

var FileConsumer = function(attr) {
  attr = attr || {};
  this.__super__(attr);
  this._filepath = attr.filepath;
  this._buffer = [];
  this._writeStream = fs.createWriteStream(
      this._filepath, {highWaterMark: '1000000kb'});
};

var prototype = FileConsumer.prototype;

prototype.consumeEOS = function() {
  var consumer = this;
  this._writeStream.end('', null, function(err) {
    consumer.emit('done', err);
  });
};

prototype.consume = function(tuple) {
  var consumer = this, success,
      str = tuple.join('');
  this._writeStream.write(str, null, function(err) {
    if (err) {
      consumer.emit('done', err);
    }
  });
};

module.exports = extend(FileConsumer, element);
