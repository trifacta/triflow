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
      var mapElement = new triflow.element.map('map', {}, [mapper]);
      mapElement.wire([consumer]);
      mapElement.consume(['a']);
      mapElement.consume(['b']);
      mapElement.consumeEOS();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
