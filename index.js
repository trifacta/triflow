// TODO: complete and test this
var self = this,
    globals = ["events", "_"],
    globalValues = {};

globals.forEach(function(global) {
  if (global in self) globalValues[global] = self[global];
});

events = require('events');
_ = require('underscore');
if (process.env.NODE_COVERAGE === 'coverage') {
  require("./triflow-coverage-node");  
} else {
  require("./triflow-node");  
}

module.exports = triflow;

globals.forEach(function(global) {
  if (global in globalValues) self[global] = globalValues[global];
  else delete self[global];
});
