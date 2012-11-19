require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test buffer': {
    'Test bufferElement with no pause': function() {
      var consumer = defaultConsumer(['0123', '4567', '89']);

      var bufferElement = new triflow.element.buffer(
          'buffer', [], {bufferSize: 10});
      bufferElement.wire([consumer]);

      var fileSource = new triflow.element.fileSource(
          'filesource', getExample('digits.txt'), {bufferSize: 4});
      fileSource.wire([bufferElement]);
      fileSource.go();
    },
    'Test bufferElement with initial pause': function() {
      var consumer = defaultConsumer(['0123', '4567', '89']);

      var bufferElement = new triflow.element.buffer(
          'buffer2', [], {bufferSize: 10});
      bufferElement.wire([consumer]);
      bufferElement.pauseConsumer(consumer);

      var fileSource = new triflow.element.fileSource(
          'filesource', getExample('digits.txt'), {bufferSize: 4});
      fileSource.wire([bufferElement]);
      fileSource.go();

      bufferElement.continueConsumer(consumer);
    }
  }
});

suite.export(module);
