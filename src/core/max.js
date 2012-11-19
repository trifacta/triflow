//= require _package.js

triflow.max = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b;
  if (arguments.length === 1) {
    while (++i < n && ((a = array[i]) == null ||
        a != a)) {
      a = undefined;
    }
    while (++i < n) {
      if ((b = array[i]) != null && b > a) {
        a = b;
      }
    }
  } else {
    while (++i < n && ((a = f.call(array, array[i], i)) == null || a != a)) {
      a = undefined;
    }
    while (++i < n) {
      if ((b = f.call(array, array[i], i)) != null && b > a) {
        a = b;
      }
    }
  }
  return a;
};

triflow.max_index = function(array, f) {
  var i = -1,
      n = array.length,
      a,
      b,
      mi = -1;
  if (arguments.length === 1) {
    while (++i < n && ((a = array[i]) == null || a != a)) {
      a = undefined;
    }
    mi = 0;
    while (++i < n) {
      if ((b = array[i]) != null && b > a) {
        a = b;
        mi = i;
      }
    }
  } else {
    while (++i < n && ((a = f.call(array, array[i], i)) == null || a != a)) {
      a = undefined;
    }
    mi = 0;
    while (++i < n) {
      if ((b = f.call(array, array[i], i)) != null && b > a) {
        a = b;
        mi = i;
      }
    }
  }
  return mi;
};
