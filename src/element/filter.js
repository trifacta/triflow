triflow.element.filter = (function() {
  var element = function(name, attr, outputs) {
    attr = attr || {};
    _.defaults(attr, {
      rows: null
    });
    this.__super__(name, attr, outputs);
    this._predicate = attr.rows;
  };

  var prototype = element.prototype;

  prototype.consume = function(data, source) {
    if (this.callFunction(this._predicate, data)) {
      this.produce(data);
    }
  };

  return triflow_constructor(element, triflow.element.tupleElement);
})();
