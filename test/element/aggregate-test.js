require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test aggregate': {
    'Test single agg': function() {
      var consumer = defaultConsumer([[3]]);
      var agg = function() {
        var count = 0;
        return {
          open: function() {},
          next: function(data) { ++count; },
          close: function() { return count; }
        };
      };
      var aggElement = new triflow.element.Aggregate(
          {groups: [], aggs: [agg]});
      aggElement.wire([consumer]);
      aggElement.consume(['a']);
      aggElement.consume(['b']);
      aggElement.consume(['b']);
      aggElement.consumeEOS();
      assert(consumer.eosHandled());
    },
    'Test single group': function() {
      var consumer = defaultConsumer([['a'], ['b']]);
      var aggElement = new triflow.element.Aggregate(
          {groups: [0], aggs: []});
      aggElement.wire([consumer]);
      aggElement.consume(['a']);
      aggElement.consume(['b']);
      aggElement.consume(['b']);
      aggElement.consumeEOS();
      assert(consumer.eosHandled());
    },
    'Test count with single group': function() {
      var consumer = defaultConsumer([['a', 1], ['b', 2]]);
      var agg = function() {
        var count = 0;
        return {
          open: function() {},
          next: function(data) { ++count; },
          close: function() { return count; }
        };
      };
      var aggElement = new triflow.element.Aggregate(
          {groups: [0], aggs: [agg]});
      aggElement.wire([consumer]);
      aggElement.consume(['a']);
      aggElement.consume(['b']);
      aggElement.consume(['b']);
      aggElement.consumeEOS();
      assert(consumer.eosHandled());
    },
    'Test multiple aggs/multiple groups': function() {
      var consumer = defaultConsumer([
        ['a', 'x', 1, 1], ['a', 'y', 2, 4], ['b', 'x', 3, 6]
      ]);
      var agg = function() {
        var count = 0;
        return {
          open: function() {},
          next: function(data) { ++count; },
          close: function() { return count; }
        };
      };
      var agg2 = function() {
        var sum = 0;
        return {
          open: function() {},
          next: function(data) { sum += data[2]; },
          close: function() { return sum; }
        };
      };
      var aggElement = new triflow.element.Aggregate(
          {groups: [0, 1], aggs: [agg, agg2]});
      aggElement.wire([consumer]);
      aggElement.consume(['a', 'x', 1]);
      aggElement.consume(['a', 'y', 1]);
      aggElement.consume(['a', 'y', 3]);
      aggElement.consume(['b', 'x', 1]);
      aggElement.consume(['b', 'x', 2]);
      aggElement.consume(['b', 'x', 3]);
      aggElement.consumeEOS();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
