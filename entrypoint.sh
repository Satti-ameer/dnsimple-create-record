#!/usr/bin/env sh

if [ -z "$INPUT_TOKEN" ] || [ -z "$INPUT_ACCOUNT" ] || [ -z "$INPUT_ZONE" ] || [ -z "$INPUT_NAME" ] || [ -z "$INPUT_TYPE" ] || [ -z "$INPUT_CONTENT" ]; then
  echo "One of the required params is empty. Please check all input params. Exiting..."
  exit 1
fi

node /usr/src/app/main.js >&1
