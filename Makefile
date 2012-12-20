# See the README for installation instructions.

NODE_MODULES_PATH ?= ./node_modules
JS_COMPILER = $(NODE_MODULES_PATH)/uglify-js/bin/uglifyjs
JS_TESTER = $(NODE_MODULES_PATH)/vows/bin/vows
SOURCEDIR = ./src
BIN_PATH = ./bin
COMPILE_PATH = ./bin/compile
COVERAGE_PATH ?= ./coverage

SOURCES := $(shell find $(SOURCEDIR) -name '*.js')

all: \
	package.json \
	triflow.js \
	triflow-node.js \
	triflow.min.js \

# Modify this rule to build your own custom release.

.INTERMEDIATE triflow.js: \
	triflow.core.js \

triflow.core.js: \
	$(SOURCES)

test: triflow-node.js
	@$(JS_TESTER)

test-cover:	triflow-coverage-node.js
	@NODE_COVERAGE='coverage' $(JS_TESTER) --cover-html
	@echo "code coverage run, see coverage.html"

triflow-node.js:
	@rm -f $@
	@node $(COMPILE_PATH)/compile-node.js > $@
	@chmod a-w $@

triflow-coverage-node.js: coverage
	@rm -f $@
	@node $(COMPILE_PATH)/compile-node.js --coverage=$(COVERAGE_PATH) > $@
	@chmod a-w $@

triflow.js: Makefile
	@rm -f $@
	@node $(COMPILE_PATH)/compile-js.js > $@
	@chmod a-w $@

triflow.min.js: triflow.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@

style: Makefile
	gjslint --jslint_error=all --nojsdoc -r src/
	gjslint --jslint_error=all --nojsdoc -r test/
	jshint --config=.jshintrc src
	jshint --config=.jshintrc test

coverage: $(SOURCES)
	@rm -r -f $(COVERAGE_PATH)
	jscoverage src coverage

install:
	mkdir -p node_modules
	npm install

package.json: $(BIN_PATH)/package.js
	@rm -f $@
	@node $(BIN_PATH)/package.js > $@
	@chmod a-w $@

clean:
	rm -f triflow*.js package.json
	rm -rf coverage coverage.html
