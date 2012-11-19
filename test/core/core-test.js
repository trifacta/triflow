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
    'Test max_index': function() {
      assert.equal(triflow.max([0, 1, 2]), 2);
      assert.equal(triflow.max_index([0, 1, 2]), 2);

      assert.equal(triflow.max([2, 1, 2]), 2);
      assert.equal(triflow.max_index([2, 1, 2]), 0);

      assert.equal(triflow.max([0, 2, 1]), 2);
      assert.equal(triflow.max_index([0, 2, 1]), 1);

      assert.equal(triflow.max([2, 1, 0]), 2);
      assert.equal(triflow.max_index([2, 1, 0]), 0);
    },
    'Test range': function() {
      assert.deepEqual(triflow.range(3), [0, 1, 2]);
    },
    'Test array': function() {
      assert.deepEqual(triflow.array(3), [0, 0, 0]);
      assert.deepEqual(triflow.array(3, [1]), [[1], [1], [1]]);
    },
    'Test functor': function() {
      assert.equal(triflow.functor(5)(), 5);
      assert.equal(triflow.functor(function() { return 5; })(), 5);
    }
  }
});

suite.export(module);
