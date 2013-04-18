var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/index').extend;

var Union = function(attr, outputs) {
  attr = attr || {};
  this._eosProducers = [];
  this.__super__(attr, outputs);
};

var prototype = Union.prototype;

prototype.consumeEOS = function(source) {
  this._eosProducers.push(source);
  if (_.difference(this._producers, this._eosProducers).length === 0) {
    this.produceEOS();
  }
};

module.exports = extend(Union, TupleElement);

