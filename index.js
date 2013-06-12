// TODO: complete and test this
var self = this,
    globals = ["events", "_"],
    globalValues = {};

globals.forEach(function(global) {
  if (global in self) globalValues[global] = self[global];
});

events = require('microee');
_ = require('underscore');

module.exports = triflow = (typeof process != 'undefined' &&
  process.env && process.env.NODE_COVERAGE ?
  require("./coverage") : require("./src"));

globals.forEach(function(global) {
  if (global in globalValues) self[global] = globalValues[global];
  else delete self[global];
});
