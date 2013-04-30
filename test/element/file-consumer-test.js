require('./env');

var vows = require('vows'),
    assert = require('assert'),
    temp = require('temp'),
    fs = require('fs');

var suite = vows.describe('type');

suite.addBatch({
  'test consumer': {
    'topic': function() {
      var data = [];
      var tmpFile = temp.openSync('trifactaText');
      var fileConsumer = new triflow.element.FileConsumer(
          {
            bufferSize: 4,
            filepath: tmpFile.path
          });
      fileConsumer.consume(['abc']);
      fileConsumer.consume(['def']);
      fileConsumer.consumeEOS(['abc']);
      var topicCallback = this.callback;
      fileConsumer.on('done', function() {
        topicCallback(null, tmpFile);
      });
    },
    'test results': function(tmpFile) {
      var result = String(fs.readFileSync(tmpFile.path));
      assert.equal(result, 'abcdef');
    }
  }
});

suite.export(module);
