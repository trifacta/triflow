require('../env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test registry': {
    'test oop': function() {
      var dog;

      var newDog = function() {
        return function() {
          if (this.__super__) {
            this.__super__();
          }
          this.name = function() {
            return 'dog';
          };
        };
      };

      // cover copyObject
      assert.deepEqual(triflow.copyObject(['fido', 'spot']), ['fido', 'spot']);
      var obj = {pet: 'fido'};
      assert.deepEqual(triflow.copyObject(obj), obj);

      var pet = function() {
        this.name = function() {
          return 'pet';
        };
        this.animal = new triflow.constructor(pet);
        this.loud = function() {return false;};
      };

      var animal = function() {
        this.name = function() {
          return 'animal';
        };
        this.wild = function() {return false;};
      };

      var barker = function() {
        this.bark = function() {};
        this.loud = function() {return true;};
      };

      dog = triflow.constructor(new newDog());

      assert.equal(new dog().name(), 'dog');
      assert.isUndefined(new dog().feed);

      dog = triflow.constructor(new newDog(), pet);
      assert.equal(new dog().name(), 'dog');
      assert.notEqual(new dog().loud, undefined);
    },
    'Test logging': function() {
      // redirect stdout log msgs to a string variable to hide test log msgs
      var old_write = process.stdout.write;
      var log_buffer = '';
      process.stdout.write = function(string, encoding, fd) {
        log_buffer += string;
      };

      triflow.log.trace('testing: ignore this message');
      triflow.log.fatal('testing: ignore this message (non-fatal)');
      triflow.log('nonsense', 'bad level');
      triflow.log(100, 'level too high');

      // reinstate stdout
      process.stdout.write = old_write;

      // test for log msgs
      var logpatt = /TRACE.*\nFATAL.*/m;
      assert(logpatt.test(log_buffer));
    }
  }
});

suite.export(module);
