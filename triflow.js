/** Copyright 2012 Trifacta Inc. All Rights Reserved. */
(function() {
triflow = {version: '1.0.0'}; // semantic versioning

triflow_constructor = function(func, parent) {
  if (parent) {
    var p = parent;
    _.defaults(func.prototype, p.prototype);
    func.prototype.__super__ = function() {
      // Temporarily change the __super__ to
      // parents super for cascading __super__ cals.
      var temp = this.__super__;
      this.__super__ = p.prototype.__super__;
      p.apply(this, arguments);
      this.__super__ = temp;
    };
  }
  return func;
};

triflow.constructor = triflow_constructor;

triflow.copyObject = function(obj) {
  var copy, val;
  if (_.isArray(obj)) {
    copy = [];
    for (var i = 0; i < obj.length; ++i) {
      copy.push(triflow.copyObject(obj[i]));
    }
  }
  else if (_.isObject(obj) && !_.isRegExp(obj)) {
    copy = {};
    for (var prop in obj) {
      copy[prop] = triflow.copyObject(obj[prop]);
    }
  } else {
    copy = obj;
  }
  return copy;
};

triflow.log = function(level, msg) {
  var l = triflow.log;
  level = Number(level);
  if (isNaN(level) || l.level > level) {
    return;
  }
  if (level > l.FATAL) {
    level = l.FATAL;
  }
  l.print([l.LEVELS[level], new Date(), msg].join('\t'));
};

triflow.log.TRACE = 0;
triflow.log.DEBUG = 1;
triflow.log.INFO = 2;
triflow.log.WARN = 3;
triflow.log.ERROR = 4;
triflow.log.FATAL = 5;
triflow.log.LEVELS = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL'
];

triflow.log.print = console ?
    function(x) { console.log(x); } :
    function() {};

triflow.log.level = 0;

triflow.log.trace = function(msg) { triflow.log(triflow.log.TRACE, msg); };
triflow.log.debug = function(msg) { triflow.log(triflow.log.DEBUG, msg); };
triflow.log.info = function(msg) { triflow.log(triflow.log.INFO, msg); };
triflow.log.warn = function(msg) { triflow.log(triflow.log.WARN, msg); };
triflow.log.error = function(msg) { triflow.log(triflow.log.ERROR, msg); };
triflow.log.fatal = function(msg) { triflow.log(triflow.log.FATAL, msg); };
var triflow_arraySubclass = [].__proto__ ?
    // Until ECMAScript supports array subclassing,
    // prototype injection works well.
    function(array, prototype) {
      array.__proto__ = prototype;
    } :
    // And if your browser doesn't support __proto__,
    // we'll use direct extension.
    function(array, prototype) {
      for (var property in prototype) {
        array[property] = prototype[property];
      }
    };

triflow.array = function(n, v) {
  var a = new Array(n), i;
  if (arguments.length > 1) {
    if (triflow.isArray(v)) {
      for (i = n; --i >= 0;) { a[i] = v.slice(); }
    } else {
      for (i = n; --i >= 0;) { a[i] = v; }
    }
  } else {
    for (i = n; --i >= 0;) { a[i] = 0; }
  }
  return a;
};

triflow.isArray = function(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
};

triflow.isQuantitative = function(array) {
  if (!array || array.length === 0) {
    return undefined;
  }

  // choose the number of samples as N/log(N) a la Valiant
  var samples = 1 + ~~(array.length / (1 + Math.log(array.length))),
      rand = triflow.rand.integer(array.length),
      val;
  for (var i = 0; i < samples; ++i) {
    val = array[rand()];
    if (typeof val === 'number') {
      return true;
    }
  }
  return false;
};

triflow.search = function(array, value) {
  var low = 0, high = array.length - 1;
  while (low <= high) {
    var mid = (low + high) >> 1, midValue = array[mid];
    if (midValue < value) { low = mid + 1; }
    else if (midValue > value) { high = mid - 1; }
    else { return mid; }
  }
  var i = -low - 1;
  return (i < 0) ? (-i - 1) : i;
};

triflow.lookupTable = function(array) {
  var c = [],
      d = {},
      v, i, len;

  for (i = 0, len = array.length; i < len; ++i) {
    if (d[v = array[i]] === undefined) {
      d[v] = 1;
      c.push(v);
    }
  }

  return typeof(c[0]) !== 'number' ?
      c.sort() :
      c.sort(function(a, b) { return a - b; });
};
triflow.entries = function(map) {
  var entries = [];
  for (var key in map) {
    entries.push({key: key, value: map[key]});
  }
  return entries;
};
function triflow_functor(v) {
  return typeof v === 'function' ? v : function() { return v; };
}

triflow.functor = triflow_functor;
triflow.keys = function(map) {
  var keys = [];
  for (var key in map) {
    keys.push(key);
  }
  return keys;
};
triflow.max = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;
  if (arguments.length === 1) {
    while (++i < n && ((a = array[i]) == null || a != a)) {
      a = undefined;
    }
    while (++i < n) {
      if ((b = array[i]) != null && b > a) {
        a = b;
      }
    }
  } else {
    while (++i < n && ((a = f.call(array, array[i], i)) == null || a != a)) {
      a = undefined;
    }
    while (++i < n) {
      if ((b = f.call(array, array[i], i)) != null && b > a) {
        a = b;
      }
    }
  }
  return a;
};

triflow.max_index = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b,
      mi = -1;
  if (arguments.length === 1) {
    while (++i < n && ((a = array[i]) == null || a != a)) {
      a = undefined;
    }
    mi = 0;
    while (++i < n) {
      if ((b = array[i]) != null && b > a) {
        a = b;
        mi = i;
      }
    }
  } else {
    while (++i < n && ((a = f.call(array, array[i], i)) == null || a != a)) {
      a = undefined;
    }
    mi = 0;
    while (++i < n) {
      if ((b = f.call(array, array[i], i)) != null && b > a) {
        a = b;
        mi = i;
      }
    }
  }
  return mi;
};
function triflow_data_range_integerScale(x) {
  var k = 1;
  while (x * k % 1) {
    k *= 10;
  }
  return k;
}

triflow.range = function(start, stop, step) {
  if (arguments.length < 3) {
    step = 1;
    if (arguments.length < 2) {
      stop = start;
      start = 0;
    }
  }
  if ((stop - start) / step === Infinity) {
    throw new Error('infinite range');
  }
  var range = [],
      k = triflow_data_range_integerScale(Math.abs(step)),
      i = -1,
      j;
  start *= k, stop *= k, step *= k;
  if (step < 0) {
    while ((j = start + step * ++i) > stop) {
      range.push(j / k);
    }
  } else {
    while ((j = start + step * ++i) < stop) {
      range.push(j / k);
    }
  }
  return range;
};
triflow.values = function(map) {
  var values = [];
  for (var key in map) {
    values.push(map[key]);
  }
  return values;
};
var triflow_dataflow_pause = -1;
var triflow_dataflow_continue = 1;
var triflow_dataflow_EOF = 0;
var triflow_dataflow_DATA = 1;

triflow.element = {
  DATA: triflow_dataflow_DATA,
  EOF: triflow_dataflow_EOF
};

triflow.element.element = (function() {
  var element = function(name, attr) {
    attr = attr || {};

    this._name = name;
    this._attr = attr;
    this._producers = [];
    this._consumers = [];
    this._seenEOS = false;
    this._pausedConsumers = {};
    this._buffer = [];
  };

  var prototype = element.prototype;

  prototype.name = function(consumer) {
    return this._name;
  };

  prototype.attr = function(key) {
    return this._attr[key];
  };

  prototype.pausedConsumers = function() {
    return this._pausedConsumers;
  };

  prototype.buffer = function() {
    return this._buffer;
  };

  prototype.consumeEOS = function(source) {
    this._seenEOS = true;
    if (this.consumersReady()) {
      this.produceEOS();
    }
  };

  prototype.produceEOS = function() {
    if (this.consumersReady() && this.bufferEmpty()) {
      var consumers = this._consumers, i;
      for (i = 0; i < consumers.length; ++i) {
        consumers[i].consumeEOS(this);
      }
    }
  };

  prototype.produce = function(data) {
    var consumers = this._consumers, i;

    for (i = 0; i < consumers.length; ++i) {
      consumers[i].consume(data, this);
    }
  };

  prototype.consume = function(data, source) {
    this.produce(data);
  };

  // Logic for pausing/resuming.
  prototype.pauseConsumer = function(consumer) {
    this._pausedConsumers[consumer.name()] = 1;
  };

  prototype.consumersReady = function() {
    for (var i in this._pausedConsumers) { return false;}
    return true;
  };

  prototype.bufferEmpty = function() {
    return (this._buffer.length === 0);
  };

  prototype.bufferFull = function() {
    return (this._buffer.length);
  };

  prototype.continueConsumer = function(consumer) {
    delete this._pausedConsumers[consumer.name()];
    if (this.consumersReady()) {
      this.clearBuffer();
    }
  };

  prototype.clearBuffer = function() {
    var data = _buffer[0];

    _buffer = [];
    this.produce(data);

    if (this._seenEOS) {
      this.produceEOS();
    }
  };
  // End logic for pausing/resuming.

  prototype.producers = function() {
    return this._producers;
  };

  prototype.consumers = function() {
    return this._consumers;
  };

  prototype.wire = function(elements) {
    if (!_.isArray(elements)) {
      elements = [elements];
    }
    this._consumers = elements.slice();
    elements.forEach(function(e) {
      e.producers().push(this);
    }, this);
  };

  return triflow_constructor(element);
})();

triflow.element.fileSource = (function() {
  var source = function(name, filepath, attr) {
    attr = attr || {
      bufferSize: 1000
    };
    this.__super__(name, attr);
    this._filepath = filepath;
    this._bufferSize = attr.bufferSize;
  };

  var prototype = source.prototype;

  prototype.go = function(ondone) {
    // Assume one consumer for now.
    var consumer = this._consumers[0],
        bufferSize = this._bufferSize,
        buffer = new Buffer(bufferSize);

    var onRead = function(err, fd) {
      var readFrom = function(position) {
        var str, callback;
        callback = function(err, bytesRead, buf) {
          if (bytesRead < bufferSize) {
            str = String(buf.slice(0, bytesRead));
            if (bytesRead > 0) {
              consumer.consume(str, this);
            }
            consumer.consumeEOS(this);
          }
          else {
            str = String(buf);
            consumer.consume(str, this);
            readFrom(position += bytesRead);
          }
        };
        fs.read(fd, buffer, 0, bufferSize, position, callback);
      };
      readFrom(0);
    };
    fs.open(this._filepath, 'r', onRead);
  };

  return triflow_constructor(source, triflow.element.element);
})();
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
triflow.element.tupleElement = (function() {
  var element = function(name, attr, outputs) {
    this.__super__(name, attr);
    this._outputs = outputs;
  };

  var prototype = element.prototype;

  prototype.outputs = function() {
    return this._outputs;
  };

  prototype.callFunction = function(func, data, accum) {
    var outputArity = func.outputArity;
    if (outputArity === undefined) {
      outputArity = 1;
    }

    var inputColumns = func.inputColumns,
        result;
    if (inputColumns) {
      var inputs = inputColumns.map(function(i) {
        return data[i];
      });
      result = func.apply(null, inputs);
    } else {
      result = func.call(null, data);
    }
    if (accum) {
      if (outputArity > 1) {
        triflow.range(outputArity).forEach(function(r) {
          accum.push(result[r]);
        });
      } else {
        accum.push(result);
      }
    } else {
      return result;
    }
  };

  prototype.project = function(data) {
    var outputs = [];
    for (var i = 0; i < this._outputs.length; ++i) {
      var output = this._outputs[i];
      if (typeof output === 'number') {
        outputs.push(data[output]);
      } else {
        this.callFunction(output, data, outputs);
      }
    }
    return outputs;
  };

  prototype.produce = function(data) {
    var consumers = this._consumers, i;
    var output;

    if (this._outputs && this._outputs.length) {
      output = this.project(data);
    } else {
      output = data;
    }

    for (i = 0; i < consumers.length; ++i) {
      consumers[i].consume(output, this);
    }
  };

  return triflow_constructor(element, triflow.element.element);
})();
// TODO: Multiple aggregates should reuse computation.
// For instance, average could reuse sum or count.
triflow.element.aggregate = (function() {
  var element = function(name, attr) {
    attr = attr || {};
    _.defaults(attr, {
      groups: [],
      aggs: []
    });
    this.__super__(name, attr, []);
    this._groups = attr.groups;
    this._aggs = attr.aggs;
    this._groupLookup = {};
  };

  var prototype = element.prototype;

  // TODO: Order groups on way out?
  // TODO: Leave in empty groups?
  prototype.consumeEOS = function(source) {
    // Finalize aggs.
    // Push all groups out.
    var group, groupLookup = this._groupLookup, element = this;
    function nextLevel(group, levels) {
      if (_.isArray(group)) {
        var aggs = [];
        for (i = group.length - 1; i >= 0; --i) {
          aggs.push(group[i].close());
        }
        element.produce(levels.concat(aggs));
      } else {
        for (var g in group) {
          nextLevel(group[g], levels.concat(g));
        }
      }
    }
    nextLevel(this._groupLookup, []);
    this.produceEOS();
  };

  prototype.consume = function(data, source) {
    // Compute group key.
    var i, groups = this._groups,
        groupLookup = this._groupLookup, key, groupAggs;
    var aggs = this._aggs, lastGroup = groups.length - 1;
    for (i = 0; i < groups.length; ++i) {
      key = groups[i](data);
      groupAggs = groupLookup[key];
      // If key doesnt exist, add it to hash.
      if (groupAggs === undefined) {
        var init;
        if (i === lastGroup) {
          // If we are in the last group, then we store and
          // initialize all the aggregates for that group.
          init = [];
          for (var j = aggs.length - 1; j >= 0; j--) {
            var agg = aggs[j]();
            agg.open();
            init.push(agg);
          }
        } else {
          // Otherwise, we add another level of nesting for
          // multi-group keys.
          init = {};
        }
        groupAggs = groupLookup[key] = init;
      }
      groupLookup = groupAggs;
    }
    for (i = aggs.length - 1; i >= 0; i--) {
      groupLookup[i].next(data);
    }    // Else initialize aggs.
    // Update aggs.
  };

  return triflow_constructor(element, triflow.element.tupleElement);
})();
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
triflow.element.map = (function() {
  var element = function(name, attr, outputs) {
    this.__super__(name, attr, outputs);
  };

  var prototype = element.prototype;

  prototype.consume = function(data, source) {
    this.produce(data);
  };

  return triflow_constructor(element, triflow.element.tupleElement);
})();
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
triflow.element.buffer = (function() {
  var element = function(name, outputs, attr) {
    attr = attr || {};

    this._pausedConsumers = {};
    this._bufferSize = attr.bufferSize || 1000;
    this._buffer = Array(this._bufferSize);
    this._writeIndex = 0;
    this._readIndex = 0;
    this._recentRead = true;

    this.__super__(name, outputs, attr);
  };

  var prototype = element.prototype;

  prototype.clearBuffer = function() {
    var consumers = this._consumers, i;
    while (this.consumersReady() && !this.bufferEmpty()) {
      this.produce(this.readFromBuffer());
    }
    if (this._seenEOS) {
      this.produceEOS();
    }
  };

  prototype.bufferEmpty = function() {
    return (this._writeIndex === this._readIndex && this._recentRead === true);
  };

  prototype.bufferFull = function() {
    return (this._writeIndex === this._readIndex && this._recentRead === false);
  };

  prototype.writeToBuffer = function(data) {
    var writeIndex = this._writeIndex, readIndex = this._readIndex;
    if (this.bufferFull()) {
      throw new Error('Buffer is full.');
    }
    this._buffer[writeIndex] = data;
    if (writeIndex === this._bufferSize - 1) {
      this._writeIndex = 0;
    } else {
      ++this._writeIndex;
    }
    this._recentRead = false;
  };

  prototype.readFromBuffer = function() {
    var writeIndex = this._writeIndex, readIndex = this._readIndex;

    if (this.bufferEmpty()) {
      throw new Error('Buffer is empty.');
    }
    data = this._buffer[readIndex];

    if (readIndex === this._bufferSize - 1) {
      this._readIndex = 0;
    } else {
      ++this._readIndex;
    }
    this._recentRead = true;

    return data;
  };

  prototype.consume = function(data, source) {
    if (this.consumersReady() && this.bufferEmpty()) {
      this.produce(data);
    } else {
      this.writeToBuffer(data);
    }
  };

  return triflow_constructor(element, triflow.element.tupleElement);
})();

}());