require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'base element test': {
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
    },
    'Test pause/continue': function() {
      var element = new triflow.element.Element({
        elementId: 0
      });
      var consumer = new triflow.element.Element({
        elementId: 1
      });
      var consumer2 = new triflow.element.Element({
        elementId: 2
      });
      element.wire(consumer);
      element.wire(consumer2);
      assert(!element.hasPausedConsumer());
      consumer.pause();
      assert(element.hasPausedConsumer());
      consumer.resume();
      assert(!element.hasPausedConsumer());

      consumer.pause();
      consumer2.pause();
      assert(element.hasPausedConsumer());
      consumer.resume();
      assert(element.hasPausedConsumer());
      consumer2.resume();
      assert(!element.hasPausedConsumer());
    }
  }
});

suite.export(module);
