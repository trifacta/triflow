var _ = require('underscore');

function generateStrings(cardinality, length) {
  return _.map(_.range(cardinality), function(i) {
    return _.map(_.range(length), function(j) {
      return String.fromCharCode(Math.floor(i + 2 + j + 1)+65);
    }).join('');
  });
};


function generateTestData(opt) {
  opt = _.defaults(opt || {}, {
    strColumns: 3,
    strLength: 5,
    uniqueValueRatio: .1,
    numericColumns: 3,
    numRows: 100,
    exactRatio: true
  });
  var strings = generateStrings(
      Math.floor(opt.numRows * opt.uniqueValueRatio), opt.strLength);
  return _.reduce(_.range(opt.numRows), function(accum, value, index) {
    var nextRow = _.map(_.range(opt.strColumns), function(c) {
      return strings[(index * (c + 1)) % strings.length];
    });
    accum.push(nextRow);
    return accum;
  }, []);
}

module.exports = generateTestData;