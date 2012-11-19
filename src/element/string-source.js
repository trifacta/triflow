triflow.element.stringSource = (function() {
  var source = function(name, str, attr) {
    attr = attr || {
      bufferSize: 1
    };
    this.__super__(name, attr);
    this._str = str;
    this._bufferSize = attr.bufferSize;
    this._index = 0;
  };

  var prototype = source.prototype;

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

  return triflow_constructor(source, triflow.element.element);
})();
