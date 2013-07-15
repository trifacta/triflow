var _ = require('underscore'),
    element = require('./Element'),
    extend = require('../core/extend'),
    fs = require('fs'),
    elementConstants = require('./constants');

var FileSource = function(attr) {
  attr = _.defaults(attr || {}, {
    bufferSize: 1000
  });
  this.__super__(attr);
  this._filepath = attr.filepath;
  this._bufferSize = attr.bufferSize;
};

var prototype = FileSource.prototype;

prototype.outputType = function() {
  return elementConstants.outputType.BYTES;
};

prototype.go = function(ondone) {
  // Assume one consumer for now.
  var myElement = this,
      bufferSize = this._bufferSize,
      buffer = new Buffer(bufferSize);

  var onRead = function(err, fd) {
    var readFrom = function(position) {
      var str, callback;
      callback = function(err, bytesRead, buf) {
        if (bytesRead < bufferSize) {
          str = String(buf.slice(0, bytesRead));
          if (bytesRead > 0) {
            myElement.produce([str]);
          }
          myElement.produceEOS();
        }
        else {
          str = String(buf);
          myElement.produce([str]);
          readFrom(position += bytesRead);
        }
      };
      if (myElement._activeConsumers.length === 0) {
        myElement.produceEOS();
      }
      fs.read(fd, buffer, 0, bufferSize, position, callback);
    };
    readFrom(0);
  };
  fs.open(this._filepath, 'r', onRead);
};

extend(FileSource, element);

module.exports = FileSource;
