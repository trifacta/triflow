require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'code coverage for element': {
    'Test accessors': function() {
      var consumer = defaultConsumer([['a', 'b']]);
      var simpleElement = new triflow.element.Element(
          {'c1': 0, 'c2': 1});
      simpleElement.wire(consumer);
      assert.deepEqual(simpleElement.consumers(), [consumer]);
      assert.equal(simpleElement.attr('c1'), 0);
      assert.equal(simpleElement.attr('c2'), 1);
      simpleElement.consume(['a', 'b']);
      simpleElement.consumeEOS();
    }
  }
});

suite.export(module);
