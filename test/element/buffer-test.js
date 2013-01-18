require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('buffer');

suite.addBatch({
  'Test bufferElement no pause': {
    topic: function() {
      var consumer = defaultConsumer(['0123', '4567', '89'], this.callback);
      var bufferElement = new triflow.element.Buffer(
          'buffer', [], {bufferSize: 3});
      bufferElement.wire([consumer]);

      var fileSource = new triflow.element.FileSource(
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

      var bufferElement = new triflow.element.Buffer(
          'buffer2', [], {bufferSize: 10});
      bufferElement.wire([consumer]);
      bufferElement.pauseConsumer(consumer);
      assert.deepEqual(bufferElement.pausedConsumers(), {'consumer': 1});

      var fileSource = new triflow.element.FileSource(
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
}).addBatch({
  'Test bufferElement over/underflow checks': {
    'over/underflow': function() {
      var consumer = defaultConsumer(['0123', '4567', '89'], this.callback);
      var bufferElement = new triflow.element.Buffer(
          'buffer3', [], {bufferSize: 2});
      bufferElement.wire([consumer]);
      // underflow buffer
      assert.throws(function() {bufferElement.readFromBuffer();});
      bufferElement.pauseConsumer(consumer);
      // fill buffer
      bufferElement.consume('0123');
      bufferElement.consume('4567');
      // now drain buffer so indexes are at end
      bufferElement.readFromBuffer();
      bufferElement.readFromBuffer();
      // now refill buffer
      bufferElement.consume('0123');
      bufferElement.consume('4567');
      // now overflow buffer
      assert.throws(function() {bufferElement.consume('89');});
    }
  }
});

suite.export(module);
