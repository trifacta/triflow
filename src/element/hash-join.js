triflow.element.hashJoin = (function() {
  var element = function(name, attr, outputs) {
    attr = attr || {};
    _.defaults(attr, {
      buildJoinColumn: null,
      probeJoinColumn: null
    });
    this.__super__(name, attr, outputs);
    this._buildIndex = 0;
    this._probeIndex = 1;
    this._joinBuffer = {};
    this._buildEOS = false;
    this._probeEOS = false;
    this._probeBuffer = null;
    this._buildJoinColumn = attr.buildJoinColumn;
    this._probeJoinColumn = attr.probeJoinColumn;
  };

  var prototype = element.prototype;

  prototype.consumeEOS = function(source) {
    if (source === this._producers[this._buildIndex]) {
      this._buildEOS = true;
      if (this._probeBuffer) {
        this.consume(this._probeBuffer, this._producers[this._probeIndex]);
        this._probeBuffer = null;
        this._producers[this._probeIndex].continueConsumer(this);
      }
    }
    if (source === this._producers[this._probeIndex]) {
      this._probeEOS = true;
    }

    if (this._buildEOS && this._probeEOS) {
      this.produceEOS();
    }
  };

  prototype.consume = function(data, source) {
    var producers = this._producers,
        joinBuffer = this._joinBuffer,
        joinVal;
    if (source === producers[this._buildIndex]) {
      if (this._buildEOS) {
        throw new Error('Input after buildEOF');
      }
      joinVal = data[this._buildJoinColumn];
      if (!joinBuffer[joinVal]) {
        joinBuffer[joinVal] = [data];
      } else {
        joinBuffer[joinVal].push(data);
      }
    }
    else if (source === producers[this._probeIndex]) {
      if (this._probeEOS) {
        throw new Error('Input after probeEOF');
      }
      if (this._buildEOS) {
        joinVal = data[this._probeJoinColumn];
        var cached = joinBuffer[joinVal];
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

  return triflow_constructor(element, triflow.element.tupleElement);
})();
