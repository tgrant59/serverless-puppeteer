# serverless-puppeteer

Runs Puppeteer on AWS Lambda with Serverless

## Commands
- `make help` - show a help message
- `make install` - install dependencies, blows up node_modules
- `make lint` - runs eslint
- `make lint-fix` - attempts to autofix linting errors
- `make test` - runs the full test suite with Jest
- `make test-watch` - re-runs tests on file changes - VERY useful
- `make test-snapshots` - updates Jest snapshots
- `make test-coverage` - creates a coverage report and opens it in your browser
- `make package` - packages the Lambda functions for debugging purposes
- `FUNCTION=function-name make run-local` - runs a function locally for testing

## Getting Started
0. Install dependencies
    - `nvm`
    - *Optional* Install `serverless` globally
    - *Optional* Install `watchman` for using `make test-watch`
 
0. Run `make install`
