var TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var MapElement = function(attr, outputs) {
  this.__super__(attr, outputs);
};

module.exports = extend(MapElement, TupleElement);

