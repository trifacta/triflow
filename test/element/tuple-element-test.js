require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test tuple-element': {
    'Test accessors': function() {
      var consumer = defaultConsumer([['a', 'b']]);
      var simpleElement = new triflow.element.TupleElement(
          'passthru', {'c1': 0, 'c2': 1}, [0, 1]);
      assert.deepEqual(simpleElement.outputs(), [0, 1]);
    }
  }
});

suite.export(module);
