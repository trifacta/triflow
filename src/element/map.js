//= require tuple-element.js

triflow.element.map = (function() {
  var element = function(name, attr, outputs) {
    this.__super__(name, attr, outputs);
  };

  var prototype = element.prototype;

  return triflow_constructor(element, triflow.element.tupleElement);
})();
