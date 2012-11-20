require('./env');

defaultConsumer = function(expectedResult) {
  var data = [], arr = [], eosSeen = false;
  return {
    producers: function() { return arr; },
    consume: function(str) { data.push(str); },
    name: function() { return 'consumer'; },
    eosHandled: function() { return eosSeen; },
    consumeEOS: function() {
      eosSeen = true;
      assert.deepEqual(data, expectedResult);
    }
  };
};

