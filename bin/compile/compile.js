#!/usr/bin/env node
require('snockets');
fs = require('fs');
_ = require('underscore');
argv = require('optimist').argv
Snockets = require('snockets');

snockets = new Snockets();

requireTreeFile = 'bin/compile/compile-require.js';

SRC_DIR = argv.src || 'src';
COVERAGE_DIR = argv.coverage;

fs.writeFileSync(requireTreeFile, "//= require_tree ../../" + SRC_DIR)

writeOutput = function(str) {
  console.log(str);
};

flags = {
  async: false
};

start = '(function(){\n';

end = '})();\n';