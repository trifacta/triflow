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
