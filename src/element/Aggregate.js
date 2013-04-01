var _ = require('underscore'),
    TupleElement = require('./TupleElement'),
    extend = require('../core/extend');

// TODO: Multiple aggregates should reuse computation.
// For instance, average could reuse sum or count.
var Aggregate = module.exports = function(name, attr) {
  attr = attr || {};
  _.defaults(attr, {
    groups: [],
    aggs: []
  });
  this.__super__(name, attr, []);
  this._groups = attr.groups;
  this._aggs = attr.aggs;
  this._groupLookup = this._groups.length ? {} : null;
};

var prototype = Aggregate.prototype;

// TODO: Order groups on way out?
// TODO: Leave in empty groups?
prototype.consumeEOS = function(source) {
  // Finalize aggs.
  // Push all groups out.
  var group, groupLookup = this._groupLookup, element = this;
  function nextLevel(group, levels) {
    if (_.isArray(group)) {
      var aggs = [];
      for (i = group.length - 1; i >= 0; --i) {
        aggs.push(group[i].close());
      }
      element.produce(levels.concat(aggs));
    } else {
      for (var g in group) {
        nextLevel(group[g], levels.concat(g));
      }
    }
  }
  nextLevel(this._groupLookup, []);
  this.produceEOS();
};

function initializeAggs(aggs) {
  var init = [];
  for (var j = aggs.length - 1; j >= 0; j--) {
    var agg = aggs[j]();
    agg.open();
    init.push(agg);
  }
  return init;
}

prototype.consume = function(data, source) {
  // Compute group key.
  var i, groups = this._groups,
      groupLookup = this._groupLookup, key, groupAggs;
  var aggs = this._aggs, lastGroup = groups.length - 1;
  if (groupLookup === null) {
    this._groupLookup = groupLookup = initializeAggs(this._aggs);
  }
  for (i = 0; i < groups.length; ++i) {
    key = groups[i](data);
    groupAggs = groupLookup[key];
    // If key doesnt exist, add it to hash.
    if (groupAggs === undefined) {
      var init;
      if (i === lastGroup) {
        // If we are in the last group, then we store and
        // initialize all the aggregates for that group.
        init = initializeAggs(this._aggs);
      } else {
        // Otherwise, we add another level of nesting for
        // multi-group keys.
        init = {};
      }
      groupAggs = groupLookup[key] = init;
    }
    groupLookup = groupAggs;
  }
  for (i = aggs.length - 1; i >= 0; i--) {
    groupLookup[i].next(data);
  }
};

extend(Aggregate, TupleElement);
