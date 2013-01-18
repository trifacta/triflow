require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test registry': {
    'Test mapper': function() {
      var consumer = defaultConsumer([['A'], ['B']]);
      var mapper = function(data) { return data[0].toUpperCase(); };
      mapper.inputColumns = [0];
      mapper.outputArity = 1;
      var mapElement = new triflow.element.Map('map', {}, [mapper]);
      mapElement.wire([consumer]);
      mapElement.consume(['a']);
      mapElement.consume(['b']);
      mapElement.consumeEOS();
      assert(consumer.eosHandled());
    },
    'Test binary mapper': function() {
      var consumer = defaultConsumer([['A', 'B'], ['C', 'D']]);
      var mapper = function(data) {
        return [data[0].toUpperCase(), data[1].toUpperCase()];
      };
      mapper.inputColumns = undefined;
      mapper.outputArity = 2;
      var mapElement = new triflow.element.Map('map', {}, [mapper]);
      mapElement.wire([consumer]);
      mapElement.consume(['a', 'b']);
      mapElement.consume(['c', 'd']);
      mapElement.consumeEOS();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
