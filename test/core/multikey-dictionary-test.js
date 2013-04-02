require('../env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test multi-key dictionary': {
    'topic': function() {
      return new triflow.MultiKeyDictionary();
    },
    'test set/get': function(dict) {
      dict.set(['a', 'b'], 1);
      assert.deepEqual(dict.get(['a', 'b']), 1);
    },
    'test append': function(dict) {
      dict.append(['a', 'c'], 2);
      dict.append(['a', 'c'], 3);
      assert.deepEqual(dict.get(['a', 'c']), [2, 3]);
    },
    'test set/get no keys': function(dict) {
      dict.set([], 3);
      assert.deepEqual(dict.get([]), 3);
    },
    'test append no keys': function(dict) {
      dict.clear();
      dict.append([], 4);
      dict.append([], 5);
      assert.deepEqual(dict.get([]), [4, 5]);
    }
  }
});

suite.export(module);
