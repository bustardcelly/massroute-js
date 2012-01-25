# Lint - JSHint
LINT = ./build/lint/jshint
SRC_DIR = ./script

# Tests - PhantomJS
PHANTOM = ./build/phantom/phantomjs
PHANTOM_QUNIT_RUNNER = ./build/phantom/run-qunit.js
TEST_DIR = ./test
TEST_INDEX_URL = file://localhost/Users/toddanderson/Repositories/massroute_js/massroute-examples/common/test/index.html

all: lint phantom say_done

lint:
	@echo '==> JSHint $<'
	@@for file in `find ${SRC_DIR} -name "*.js"`; \
		do echo ===Linting $$file...===; ${LINT} $$file; done;
	@echo

phantom: 
	@echo '==> Phantom $<'
	${PHANTOM} ${PHANTOM_QUNIT_RUNNER} ${TEST_INDEX_URL};
	@echo

say_done:
	@echo '===> DONE!$<'
	@echo