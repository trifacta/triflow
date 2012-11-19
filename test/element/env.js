require('./env');

defaultConsumer = function(expectedResult) {
  var data = [], arr = [];
  return {
    producers: function() { return arr; },
    consume: function(str) { data.push(str); },
    name: function() { return 'consumer'; },
    consumeEOS: function() {
      assert.deepEqual(data, expectedResult);
    }
  };
};

