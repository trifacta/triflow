require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('buffer');

// assert.deepEqual(simpleElement.buffer(), []);
// assert.equal(simpleElement.bufferFull(), 0);
//
// simpleElement.clearBuffer();

suite.addBatch({
  'Test limitElement': {
    topic: function() {
      var consumer = defaultConsumer([['0123'], ['45']], this.callback);
      var limitElement = new triflow.element.Limit(
          {maxBytes: 6}, []);
      limitElement.wire([consumer]);

      var fileSource = new triflow.element.FileSource(
          {
            bufferSize: 4,
            filepath: getExample('digits.txt')
          });
      fileSource.wire([limitElement]);
      fileSource.go();
    },
    'end-of-stream': {
      'eosHandled': function(consumer) {
        assert(consumer.eosHandled());
      }
    }
  }
});

suite.export(module);
