triflow = {version: '1.0.0'}; // semantic versioning

triflow_constructor = function(func, parent) {
  if (parent) {
    var p = parent;
    _.defaults(func.prototype, p.prototype);
    func.prototype.__super__ = function() {
      // Temporarily change the __super__ to
      // parents super for cascading __super__ cals.
      var temp = this.__super__;
      this.__super__ = p.prototype.__super__;
      p.apply(this, arguments);
      this.__super__ = temp;
    };
  }
  return func;
};

triflow.constructor = triflow_constructor;

triflow.copyObject = function(obj) {
  var copy, val;
  if (_.isArray(obj)) {
    copy = [];
    for (var i = 0; i < obj.length; ++i) {
      copy.push(triflow.copyObject(obj[i]));
    }
  }
  else if (_.isObject(obj) && !_.isRegExp(obj)) {
    copy = {};
    for (var prop in obj) {
      copy[prop] = triflow.copyObject(obj[prop]);
    }
  } else {
    copy = obj;
  }
  return copy;
};

triflow.log = function(level, msg) {
  var l = triflow.log;
  level = Number(level);
  if (isNaN(level) || l.level > level) {
    return;
  }
  if (level > l.FATAL) {
    level = l.FATAL;
  }
  l.print([l.LEVELS[level], new Date(), msg].join('\t'));
};

triflow.log.TRACE = 0;
triflow.log.DEBUG = 1;
triflow.log.INFO = 2;
triflow.log.WARN = 3;
triflow.log.ERROR = 4;
triflow.log.FATAL = 5;
triflow.log.LEVELS = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL'
];

triflow.log.print = console ?
    function(x) { console.log(x); } :
    function() {};

triflow.log.level = 0;

triflow.log.trace = function(msg) { triflow.log(triflow.log.TRACE, msg); };
triflow.log.debug = function(msg) { triflow.log(triflow.log.DEBUG, msg); };
triflow.log.info = function(msg) { triflow.log(triflow.log.INFO, msg); };
triflow.log.warn = function(msg) { triflow.log(triflow.log.WARN, msg); };
triflow.log.error = function(msg) { triflow.log(triflow.log.ERROR, msg); };
triflow.log.fatal = function(msg) { triflow.log(triflow.log.FATAL, msg); };
