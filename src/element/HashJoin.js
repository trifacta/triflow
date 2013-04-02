var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    MultiKeyDictionary = require('../core/index').MultiKeyDictionary,
    extend = require('../core/index').extend;

var HashJoin = function(attr, outputs) {
  attr = attr || {};
  _.defaults(attr, {
    buildJoinColumns: [],
    probeJoinColumns: []
  });
  this.__super__(attr, outputs);
  this._buildIndex = 0;
  this._probeIndex = 1;
  this._buildId = attr.buildId;
  this._probeId = attr.probeId;
  this._joinBuffer = new MultiKeyDictionary();
  this._buildEOS = false;
  this._probeEOS = false;
  this._probeBuffer = null;
  this._buildJoinColumns = attr.buildJoinColumns;
  this._probeJoinColumns = attr.probeJoinColumns;
};

var prototype = HashJoin.prototype;

var getBuildProducer = function() {
  if (this._buildId !== undefined) {
    return _.find(this._producers, function(el) {
      return el._elementId === this._buildId;
    }, this);
  }
  return this._producers[this._buildIndex];
};

var getProbeProducer = function() {
  if (this._probeId !== undefined) {
    return _.find(this._producers, function(el) {
      return el._elementId === this._probeId;
    }, this);
  }
  return this._producers[this._probeIndex];
};

prototype.consumeEOS = function(source) {
  if (source === getBuildProducer.call(this)) {
    this._buildEOS = true;
    if (this._probeBuffer) {
      this.consume(this._probeBuffer, getProbeProducer.call(this));
      this._probeBuffer = null;
      getProbeProducer.call(this).continueConsumer(this);
    }
  }
  if (source === getProbeProducer.call(this)) {
    this._probeEOS = true;
  }

  if (this._buildEOS && this._probeEOS) {
    this.produceEOS();
  }
};

prototype.consume = function(data, source) {
  var producers = this._producers,
      joinBuffer = this._joinBuffer,
      joinKeys;
  if (source === getBuildProducer.call(this)) {
    if (this._buildEOS) {
      throw new Error('Input after buildEOF');
    }
    joinKeys = _.map(this._buildJoinColumns, function(col) {
      return data[col];
    });
    joinBuffer.append(joinKeys, data);
  }
  else if (source === getProbeProducer.call(this)) {
    if (this._probeEOS) {
      throw new Error('Input after probeEOF');
    }
    if (this._buildEOS) {
      joinKeys = _.map(this._probeJoinColumns, function(col) {
        return data[col];
      });
      var cached = joinBuffer.get(joinKeys);
      if (cached) {
        for (var i = 0; i < cached.length; ++i) {
          this.produce(cached[i].concat(data));
        }
      }
    } else {
      this._probeBuffer = data;
      source.pauseConsumer(this);
    }
  }
};

module.exports = extend(HashJoin, TupleElement);

