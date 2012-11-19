//= require _package.js

triflow.values = function(map) {
  var values = [];
  for (var key in map) {
    values.push(map[key]);
  }
  return values;
};
