//= require element.js

triflow.element.fileSource = (function() {
  var source = function(name, filepath, attr) {
    attr = attr || {
      bufferSize: 1000
    };
    this.__super__(name, attr);
    this._filepath = filepath;
    this._bufferSize = attr.bufferSize;
  };

  var prototype = source.prototype;

  prototype.go = function(ondone) {
    // Assume one consumer for now.
    var consumer = this._consumers[0],
        bufferSize = this._bufferSize,
        buffer = new Buffer(bufferSize);

    var onRead = function(err, fd) {
      var readFrom = function(position) {
        var str, callback;
        callback = function(err, bytesRead, buf) {
          if (bytesRead < bufferSize) {
            str = String(buf.slice(0, bytesRead));
            if (bytesRead > 0) {
              consumer.consume(str, this);
            }
            consumer.consumeEOS(this);
          }
          else {
            str = String(buf);
            consumer.consume(str, this);
            readFrom(position += bytesRead);
          }
        };
        fs.read(fd, buffer, 0, bufferSize, position, callback);
      };
      readFrom(0);
    };
    fs.open(this._filepath, 'r', onRead);
  };

  return triflow_constructor(source, triflow.element.element);
})();
