require('../env');

defaultConsumer = function(expectedResult, cb) {
  var data = [], arr = [], eosSeen = false;
  return {
    producers: function() { return arr; },
    consume: function(str) { data.push(str); },
    name: function() { return 'consumer'; },
    eosHandled: function() { return eosSeen; },
    data: function() {return data;},
    consumeEOS: function() {
      eosSeen = true;
      assert.deepEqual(data, expectedResult);
      if (cb) {
        var err = null;
        cb(err, this);
      }
    }
  };
};

