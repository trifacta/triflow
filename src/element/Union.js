var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/index').extend;

var Union = function(attr, outputs) {
  attr = attr || {};
  this._elements = attr.elements;
  this._eosIds = [];
  this.__super__(attr, outputs);
};

var prototype = Union.prototype;

prototype.consumeEOS = function(source) {
  this._eosIds.push(source._elementId);
  if (_.difference(this._elements, this._eosIds).length === 0) {
    this.produceEOS();
  }
};

module.exports = extend(Union, TupleElement);

