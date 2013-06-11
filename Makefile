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

# Modify this rule to build your own custom release.

.INTERMEDIATE triflow.js: \
	triflow.core.js \

triflow.core.js: \
	$(SOURCES)

.PHONY: test
test: Makefile
	@$(JS_TESTER)

test-cover:	coverage
	@NODE_COVERAGE='coverage' $(JS_TESTER) --cover-html
	@echo "code coverage run, see coverage.html"

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

clean:
	rm -rf coverage coverage.html

build:
	./node_modules/gluejs/bin/gluejs \
		--include ./index.js \
		--include ./src \
		--include ./node_modules/microee \
		--command 'uglifyjs --no-copyright --no-dead-code --mangle-toplevel' \
		--replace underscore=window._ \
		--replace fs={} \
		--global triflow \
		--main index.js \
		--out dist/triflow.js

.PHONY: test build
