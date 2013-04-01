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

      var pet = function() {
        this.name = function() {
          return 'pet';
        };
        this.animal = new triflow.extend(pet);
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

      dog = triflow.extend(new newDog());

      assert.equal(new dog().name(), 'dog');
      assert.isUndefined(new dog().feed);

      dog = triflow.extend(new newDog(), pet);
      assert.equal(new dog().name(), 'dog');
      assert.notEqual(new dog().loud, undefined);
    }
  }
});

suite.export(module);
