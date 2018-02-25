ARTIFACT_DIR = artifacts
INTERNALS_DIR = internals

# so we can use `eslint` without ./node_modules/.bin/eslint
SHELL := /bin/bash
export PATH := $(shell yarn bin):$(PATH)

# this allows us to test CI tasks locally
# eg. CI=1 make test => outputs a junit xml file
# make test => outputs onto stdout
ifdef CI
    ESLINT_ARGS=--format junit --output-file $(ARTIFACT_DIR)/test_results/eslint/eslint.junit.xml
    JEST_ENV_VARIABLES=JEST_SUITE_NAME="Jest Tests" JEST_JUNIT_OUTPUT=$(ARTIFACT_DIR)/test_results/jest/jest.junit.xml
    JEST_ARGS=--testResultsProcessor ./node_modules/jest-junit
else
    ESLINT_ARGS=
    JEST_ENV_VARIABLES=
    JEST_ARGS=
endif

# .PHONY: prevents files named 'clean' from stopping the 'clean' task from running
# https://www.gnu.org/software/make/manual/html_node/Phony-Targets.html
.PHONY: help
help:
	@echo "--------------------- Useful Commands for Development ----------------------"
	@echo "make help                            - show this help message"
	@echo "make install                         - install dependencies, blows up node_modules"
	@echo "make lint                            - runs eslint"
	@echo "make lint-fix                        - attempts to autofix linting errors"
	@echo "make test                            - runs the full test suite with jest"
	@echo "make test-watch                      - re-runs tests on file changes - VERY useful"
	@echo "make test-snapshots                  - updates the jest snapshots"
	@echo "make test-coverage                   - creates a coverage report and opens it in your browser"
	@echo "make package                         - packages the functions to deploy"

# ---- Installing, Building and Running ----

.PHONY: install
install: check-versions clean node_modules

.PHONY: package
build: check-versions node_modules
	PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true serverless package

.PHONY: run-local
run-local: check-versions node_modules
	LOCAL=true serverless invoke local --function ${FUNCTION}

# -------------- Linting --------------

.PHONY: lint
lint: check-versions node_modules ${ARTIFACT_DIR}
	eslint ${ESLINT_ARGS} .

.PHONY: lint-fix
lint-fix: check-versions node_modules
	eslint --fix .

# -------------- Testing --------------

.PHONY: test
test: check-versions node_modules ${ARTIFACT_DIR}
	${JEST_ENV_VARIABLES} NODE_ENV=test jest ${JEST_ARGS}

.PHONY: test-watch
test-watch: check-versions node_modules ${ARTIFACT_DIR}
	NODE_ENV=test jest ${JEST_ARGS} --watch

.PHONY: test-coverage
test-coverage: check-versions node_modules ${ARTIFACT_DIR}
	NODE_ENV=test jest ${JEST_ARGS} --coverage
	open ${ARTIFACT_DIR}/coverage/lcov-report/index.html

.PHONY: test-snapshots
test-snapshots: check-versions node_modules ${ARTIFACT_DIR}
	NODE_ENV=test jest ${JEST_ARGS} -u

# --------------- CI Scripts -----------------

.PHONY: install-no-clean
install-no-clean: check-versions node_modules

.PHONY: install-deployment-deps
install-deployment-deps: check-versions
	./scripts/install-deployment-deps.sh

.PHONY: deploy
deploy: check-versions node_modules
	./scripts/deploy.sh

# ----------------- Helpers ------------------

.PHONY: check-versions
check-versions:
	@./scripts/check-versions.sh

.PHONY: clean
clean:
	@if test -a node_modules/.bin/jest; then jest --clearCache; fi
	@rm -f .babel.json
	@rm -rf ${ARTIFACT_DIR}
	@rm -rf node_modules

${ARTIFACT_DIR}:
	@mkdir -p ${ARTIFACT_DIR}/coverage/lcov-report
	@mkdir -p ${ARTIFACT_DIR}/test_results/eslint
	@mkdir -p ${ARTIFACT_DIR}/test_results/jest

node_modules:
	yarn install
	@touch node_modules
