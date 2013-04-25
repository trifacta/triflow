var _ = require('underscore'),
    Element = require('./Element'),
    extend = require('../core/extend');

var FileSource = function(attr) {
  attr = _.defaults(attr || {}, {
    bufferSize: 1000
  });
  this.__super__(attr);
  this._filepath = attr.filepath;
  this._bufferSize = attr.bufferSize;
};

var prototype = FileSource.prototype;

prototype.go = function(ondone) {
  // Assume one consumer for now.
  var element = this,
      bufferSize = this._bufferSize,
      buffer = new Buffer(bufferSize);

  var onRead = function(err, fd) {
    var readFrom = function(position) {
      var str, callback;
      callback = function(err, bytesRead, buf) {
        if (bytesRead < bufferSize) {
          str = String(buf.slice(0, bytesRead));
          if (bytesRead > 0) {
            element.produce([str]);
          }
          element.produceEOS();
        }
        else {
          str = String(buf);
          element.produce([str]);
          readFrom(position += bytesRead);
        }
      };
      if (element._activeConsumers.length === 0) {
        element.produceEOS();
      }
      fs.read(fd, buffer, 0, bufferSize, position, callback);
    };
    readFrom(0);
  };
  fs.open(this._filepath, 'r', onRead);
};

extend(FileSource, Element);

module.exports = FileSource;
