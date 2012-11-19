require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test sources': {
    'Test fileSource': function() {
      var data = [];
      var consumer = {
        producers: function() { return []; },
        consume: function(str) { data.push(str); },
        consumeEOS: function() { check(); }
      };
      var fileSource = new triflow.element.fileSource(
          'filesource', getExample('digits.txt'), {bufferSize: 4});

      fileSource.wire([consumer]);
      fileSource.go();
      function check() {
        assert.deepEqual(data, ['0123', '4567', '89']);
      }
    },
    'Test stringSource': function() {

      var consumer = defaultConsumer(['abc', 'def']);
      var source = new triflow.element.stringSource(
          'source', 'abcdef', {bufferSize: 3});
      source.wire([consumer]);
      source.go();

      consumer = defaultConsumer(['abcd', 'ef']);
      source = new triflow.element.stringSource(
          'source', 'abcdef', {bufferSize: 4});
      source.wire([consumer]);
      source.go();

      consumer = defaultConsumer(['abcdef']);
      source = new triflow.element.stringSource(
          'source', 'abcdef', {bufferSize: 6});
      source.wire([consumer]);
      source.go();

      consumer = defaultConsumer(['abcdef']);
      source = new triflow.element.stringSource(
          'source', 'abcdef', {bufferSize: 7});
      source.wire([consumer]);
      source.go();
    }
  }
});

suite.export(module);
