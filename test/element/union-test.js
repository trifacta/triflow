require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test registry': {
    'Test unionElement': function() {

      var secondJoinColumn = 1, firstJoinColumn = 0;

      var consumer = defaultConsumer([
        ['a', 1], ['b', 2], ['c', 2], ['d', 3], ['e', 3]
      ]);

      var unionElement = new triflow.element.Union();
      unionElement.wire([consumer]);
      var firstElement = new triflow.element.Map();
      firstElement.wire([unionElement]);

      var secondElement = new triflow.element.Map();
      secondElement.wire([unionElement]);

      firstElement.consume(['a', 1]);
      secondElement.consume(['b', 2]);
      firstElement.consume(['c', 2]);
      firstElement.consumeEOS();
      secondElement.consume(['d', 3]);
      secondElement.consume(['e', 3]);
      secondElement.consumeEOS();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
