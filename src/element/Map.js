var TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var MapElement = module.exports = function(name, attr, outputs) {
  this.__super__(name, attr, outputs);
};

extend(MapElement, TupleElement);

