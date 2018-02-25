#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/shell-helpers.sh"

if [[ -z $STAGE ]]; then
    STAGE=dev
fi


run "aws s3 sync chrome/ s3://cdn.sunburst.io/chrome/"
run "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true STAGE=${STAGE} ./node_modules/.bin/serverless deploy"
