var Element = require('./Element'),
    extend = require('../core/extend');

var TupleElement = module.exports = function(name, attr, outputs) {
  this.__super__(name, attr);
  this._outputs = outputs;
};

var prototype = TupleElement.prototype;

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
    // TODO: Need better method to distinguish
    // arrays that should be unpacked.
    if (typeof result === 'object' && result !== null) {
      for (r = 0; r < outputArity; r++) {
        accum.push(result[r]);
      }
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
      // this output is based on a column index
      outputs.push(data[output]);
    } else {
      // this output is based on a function
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

extend(TupleElement, Element);

