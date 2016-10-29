#!/bin/bash
set -e
./node_modules/jshint/bin/jshint lib
./node_modules/istanbul/lib/cli.js cover _mocha test/tests/
./node_modules/istanbul/lib/cli.js check-coverage
