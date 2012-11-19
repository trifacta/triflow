require('../index');

fs = require('fs');
path = require('path');
vows = require('vows'),
assert = require('assert');

getExample = function(ex) {
  return path.resolve(__dirname + '/../examples/data/' + ex);
};
