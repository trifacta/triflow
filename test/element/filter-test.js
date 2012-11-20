require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test filter': {
    'Test filter with single argument': function() {
      var consumer = defaultConsumer([['a']]);
      var filter = function(data) {return data === 'a';};
      filter.inputColumns = [0];

      var filterElement = new triflow.element.filter(
          'map', {rows: filter}, [0]);
      filterElement.wire([consumer]);
      filterElement.consume(['a']);
      filterElement.consume(['b']);
      filterElement.consumeEOS();
      assert(consumer.eosHandled());
    },
    'Test filter with multiple arguments': function() {
      var consumer = defaultConsumer([['a', 1], ['c', 3]]);

      var filter = function(x, y) {return x === 'c' || y === 'c';};
      filter.inputColumns = [0, 1];

      var filterElement = new triflow.element.filter(
          'map', {rows: filter}, [0, 2]);
      filterElement.wire([consumer]);
      filterElement.consume(['a', 'c', 1]);
      filterElement.consume(['b', 'd', 2]);
      filterElement.consume(['c', 'e', 3]);
      filterElement.consumeEOS();
      assert(consumer.eosHandled());
    }

  }
});

suite.export(module);
