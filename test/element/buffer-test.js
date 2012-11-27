require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'Test bufferElement no pause': {
    topic: function() {
      var consumer = defaultConsumer(['0123', '4567', '89'], this.callback);
      var bufferElement = new triflow.element.buffer(
          'buffer', [], {bufferSize: 10});
      bufferElement.wire([consumer]);

      var fileSource = new triflow.element.fileSource(
          'filesource', getExample('digits.txt'), {bufferSize: 4});
      fileSource.wire([bufferElement]);
      fileSource.go();

    },
    'end-of-stream': {
      'eosHandled': function(consumer) {
        assert(consumer.eosHandled());
      }
    }
  }
}).addBatch({
  'Test bufferElement with initial pause': {
    topic: function() {
      var consumer = defaultConsumer(['0123', '4567', '89'], this.callback);

      var bufferElement = new triflow.element.buffer(
          'buffer2', [], {bufferSize: 10});
      bufferElement.wire([consumer]);
      bufferElement.pauseConsumer(consumer);

      var fileSource = new triflow.element.fileSource(
          'filesource', getExample('digits.txt'), {bufferSize: 4});
      fileSource.wire([bufferElement]);
      fileSource.go();
      bufferElement.continueConsumer(consumer);
    },
    'end-of-stream': {
      'eosHandled': function(consumer) {
        assert(consumer.eosHandled());
      }
    }
  }
});

suite.export(module);
