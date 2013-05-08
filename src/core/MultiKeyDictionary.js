var _ = require('underscore');

var MultiKeyDictionary = function() {
  this._dict = {};
  this._noKeys = undefined;
};

var prototype = MultiKeyDictionary.prototype;
var x = {};

function dictionaryLeaf(keys, createMissing) {
  var key, i,
      nextDict,
      currentDict = this._dict;
  for (i = 0; i < keys.length; ++i) {
    key = keys[i];
    nextDict = currentDict[key];
    if (!nextDict) {
      if (createMissing) {
        currentDict[key] = nextDict = {};
      } else {
        return undefined;
      }
    }
    currentDict = nextDict;
  }
  return currentDict;
}

prototype.clear = function() {
  this._dict = {};
  this._noKeys = undefined;
};

prototype.set = function(keys, value) {
  if (!keys.length) {
    this._noKeys = value;
    return;
  }
  var leaf = dictionaryLeaf.call(this, keys.slice(0, keys.length - 1), true);
  leaf[keys[keys.length - 1]] = value;
  return value;
};

// Shorthand for pushing onto an array.
prototype.append = function(keys, value) {
  if (!keys.length) {
    if (this._noKeys) {
      this._noKeys.push(value);
    } else {
      this._noKeys = [value];
    }
    return;
  }
  var leaf = dictionaryLeaf.call(this, keys.slice(0, keys.length - 1), true),
      lastKey = keys[keys.length - 1];
  if (leaf[lastKey]) {
    leaf[lastKey].push(value);
  } else {
    leaf[lastKey] = [value];
  }
};

prototype.get = function(keys, value) {
  if (!keys.length) {
    return this._noKeys;
  }
  return dictionaryLeaf.call(this, keys, false);
};

module.exports = MultiKeyDictionary;
