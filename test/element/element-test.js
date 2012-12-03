require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'code coverage for element': {
    'Test accessors': function() {
      var consumer = defaultConsumer([['a', 'b']]);
      var simpleElement = new triflow.element.element(
          'passthru', {'c1': 0, 'c2': 1});
      simpleElement.wire(consumer);
      assert.deepEqual(simpleElement.consumers(), [consumer]);
      assert.deepEqual(simpleElement.buffer(), []);
      assert.equal(simpleElement.bufferFull(), 0);
      assert.equal(simpleElement.attr('c1'), 0);
      assert.equal(simpleElement.attr('c2'), 1);
      simpleElement.consume(['a', 'b']);
      simpleElement.consumeEOS();
      simpleElement.clearBuffer();
    }
  }
});

suite.export(module);
