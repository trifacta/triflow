var triflow = require('../index.js');

Benchmark.options.maxTime = 1;
var suite = new Benchmark.Suite("agg suite"),
    generateTestData = require('./generateTestData');

var strColumns = 10;

var testData = generateTestData({
  numRows: 10000,
  strColumns: strColumns,
  uniqueValueRation: .1
});
// add tests
suite.add('Agg test 100000', function() {
  for (var column = 0; column < strColumns; ++column) {
    var agg = function() {
      var count = 0;
      return {
        open: function() {},
        next: function(data) { ++count; },
        close: function() { return count; }
      };
    };
    var group = column;//function(data) { return data[column]; };
    var aggElement = new triflow.element.Aggregate(
      {groups: [group], aggs: [agg]});
    var l = testData.length;
    for (var i = 0; i < l; ++i) {
      aggElement.consume(testData[i]);
    }
    aggElement.consumeEOS();
  }
})
// add listeners
.on('cycle', function(event) {
  // console.log(String(event.target));
})
.on('complete', function() {
  // console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
// .run({ 'async': false});
suite.export(module);