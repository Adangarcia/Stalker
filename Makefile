REPORTER ?= spec

test: test-unit test-functional

test-unit:
	@NODE_ENV=test
	@./node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			test/unit/*.test.js

test-functional:
	@NODE_ENV=test
	@./node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			test/functional/*.test.js


.PHONY: test test-unit test-functional
