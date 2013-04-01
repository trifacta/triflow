var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

var Filter = module.exports = function(name, attr, outputs) {
  attr = attr || {};
  _.defaults(attr, {
    rows: null
  });
  this.__super__(name, attr, outputs);
  this._predicate = attr.rows;
};

var prototype = Filter.prototype;

prototype.consume = function(data, source) {
  if (this.callFunction(this._predicate, data)) {
    this.produce(data);
  }
};

extend(Filter, TupleElement);

