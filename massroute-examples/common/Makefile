# Lint - JSHint
LINT = ./build/lint/jshint
SRC_DIR = ./script

# Tests - PhantomJS
PHANTOM = ./build/phantom/phantomjs
PHANTOM_QUNIT_RUNNER = ./build/phantom/run-qunit.js
TEST_DIR = ./test
TEST_INDEX_URL = file://localhost/Users/toddanderson/Repositories/massroute_js/massroute-examples/common/test/index.html

# Min/Concat - r.js
R_JS = java -classpath ./build/rhino/js.jar:./build/closure/compiler.jar org.mozilla.javascript.tools.shell.Main
R_DIR = ./build/require

all: lint phantom optimize

lint:
	@echo '==> JSHint $<'
	@@for file in `find ${SRC_DIR} -name "*.js"`; \
		do echo ===Linting $$file...===; ${LINT} $$file; done;
	@echo

phantom: 
	@echo '==> Phantom $<'
	${PHANTOM} ${PHANTOM_QUNIT_RUNNER} ${TEST_INDEX_URL};
	@echo

optimize:
	@echo '==> r.js $<'
	@@for file in `find ${R_DIR} -name "*.build.js"`; \
	   do echo ===r.js: $$file...===; ${R_JS} ${R_DIR}/r.js -o $$file; done;
	@echo