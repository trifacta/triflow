//= require _package.js

var triflow_arraySubclass = [].__proto__ ?
    // Until ECMAScript supports array subclassing,
    // prototype injection works well.
    function(array, prototype) {
      array.__proto__ = prototype;
    } :
    // And if your browser doesn't support __proto__,
    // we'll use direct extension.
    function(array, prototype) {
      for (var property in prototype) {
        array[property] = prototype[property];
      }
    };

triflow.array = function(n, v) {
  var a = new Array(n), i;
  if (arguments.length > 1) {
    if (triflow.isArray(v)) {
      for (i = n; --i >= 0;) { a[i] = v.slice(); }
    } else {
      for (i = n; --i >= 0;) { a[i] = v; }
    }
  } else {
    for (i = n; --i >= 0;) { a[i] = 0; }
  }
  return a;
};

triflow.isArray = function(array) {
  return Object.prototype.toString.call(array) === '[object Array]';
};

triflow.isQuantitative = function(array) {
  if (!array || array.length === 0) {
    return undefined;
  }

  // choose the number of samples as N/log(N) a la Valiant
  var samples = 1 + ~~(array.length / (1 + Math.log(array.length))),
      rand = triflow.rand.integer(array.length),
      val;
  for (var i = 0; i < samples; ++i) {
    val = array[rand()];
    if (typeof val === 'number') {
      return true;
    }
  }
  return false;
};

triflow.search = function(array, value) {
  var low = 0, high = array.length - 1;
  while (low <= high) {
    var mid = (low + high) >> 1, midValue = array[mid];
    if (midValue < value) { low = mid + 1; }
    else if (midValue > value) { high = mid - 1; }
    else { return mid; }
  }
  var i = -low - 1;
  return (i < 0) ? (-i - 1) : i;
};

triflow.lookupTable = function(array) {
  var c = [],
      d = {},
      v, i, len;

  for (i = 0, len = array.length; i < len; ++i) {
    if (d[v = array[i]] === undefined) {
      d[v] = 1;
      c.push(v);
    }
  }

  return typeof(c[0]) !== 'number' ?
      c.sort() :
      c.sort(function(a, b) { return a - b; });
};
