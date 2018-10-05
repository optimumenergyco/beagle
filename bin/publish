#!/usr/bin/env bash

set -euo pipefail

# Add the NPM token to the .npmrc file
echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" >> "$HOME/.npmrc"

# Publish the package
npm publish
