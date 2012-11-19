# See the README for installation instructions.

NODE_PATH ?= ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_TESTER = $(NODE_PATH)/vows/bin/vows

all: \
	package.json \
	triflow.js \
	triflow.min.js \


short: \
	package.json \
	triflow.js \


# Modify this rule to build your own custom release.

.INTERMEDIATE triflow.js: \
	src/start.js \
	triflow.core.js \
	triflow.wrangle.js \
	src/end.js

triflow.core.js: \
	src/core/_package.js \
	src/core/array.js \
	src/core/entries.js \
	src/core/functor.js \
	src/core/keys.js \
	src/core/max.js \
	src/core/range.js \
	src/core/values.js

triflow.wrangle.js: \
  src/element/_package.js \
  src/element/element.js \
  src/element/file-source.js \
  src/element/string-source.js \
  src/element/tuple-element.js \
  src/element/aggregate.js \
  src/element/filter.js \
  src/element/map.js \
  src/element/hash-join.js \
  src/element/buffer.js \

test-all: short
	@$(JS_TESTER)

test: short
	@$(JS_TESTER) -r 'Test|test'

triflow.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

triflow%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

triflow.min.js: triflow.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

style: Makefile
	gjslint --exclude_files=src/end.js,src/start.js --jslint_error=all --nojsdoc -r src/
	gjslint --exclude_files=src/end.js,src/start.js --jslint_error=all --nojsdoc -r test/
	jshint --config=.jshintrc src
	jshint --config=.jshintrc test

install:
	mkdir -p node_modules
	npm install

package.json: src/package.js
	@rm -f $@
	node src/package.js > $@
	@chmod a-w $@

clean:
	rm -f triflow*.js package.json
