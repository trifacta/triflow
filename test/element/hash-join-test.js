require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test registry': {
    'Test hashJoinElement': function() {

      var probeJoinColumn = 1, buildJoinColumn = 0;

      var consumer = defaultConsumer([
        ['a', 1], ['b', 2], ['b', 2], ['b', 3], ['b', 3]
      ]);

      var joinElement = new triflow.element.HashJoin({
        buildJoinColumns: [buildJoinColumn],
        probeJoinColumns: [probeJoinColumn],
        probeId: 4,
        buildId: 3
      }, [0, 1]);
      joinElement.wire([consumer]);

      var buildElement = new triflow.element.Buffer(
          {bufferSize: 10, elementId: 3});
      buildElement.wire([joinElement]);

      var probeElement = new triflow.element.Buffer(
          {bufferSize: 10, elementId: 4});
      probeElement.wire([joinElement]);

      buildElement.consume(['a']);
      buildElement.consume(['b']);
      buildElement.consume(['b']);
      buildElement.consume(['c']);
      buildElement.consumeEOS();
      probeElement.consume([1, 'a']);
      probeElement.consume([2, 'b']);
      probeElement.consume([3, 'b']);
      probeElement.consume([4, 'd']);
      probeElement.consumeEOS();
      assert(consumer.eosHandled());
      assert.throws(function() {buildElement.consume([4, 'd']);});
      assert.throws(function() {probeElement.consume([4, 'd']);});
    },
    'Test hashJoinElement with buffer': function() {
      var consumer = defaultConsumer(['bb', 'bb', 'bb', 'bb', 'aa']);

      var joinElement = new triflow.element.HashJoin({
        buildJoinColumns: [0],
        probeJoinColumns: [0]
      }, []);
      joinElement.wire([consumer]);

      var buildElement = new triflow.element.Buffer(
          {bufferSize: 10});
      buildElement.wire([joinElement]);

      var probeElement = new triflow.element.Buffer(
          {bufferSize: 10});
      probeElement.wire([joinElement]);

      buildElement.consume('a');
      probeElement.consume('b');
      probeElement.consume('b');
      probeElement.consume('d');
      buildElement.consume('b');
      buildElement.consume('b');
      buildElement.consume('c');
      probeElement.consume('a');
      probeElement.consumeEOS();
      buildElement.consumeEOS();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
