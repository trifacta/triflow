// TODO: complete and test this
var self = this,
    globals = ["events", "_"],
    globalValues = {};

globals.forEach(function(global) {
  if (global in self) globalValues[global] = self[global];
});

events = require('events');
// util = require('util');
_ = require('underscore');
require("./triflow");
module.exports = triflow;

globals.forEach(function(global) {
  if (global in globalValues) self[global] = globalValues[global];
  else delete self[global];
});
