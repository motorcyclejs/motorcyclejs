#!/bin/bash

# sign in to NPM to allow deployment
npm adduser << EOF
$NPM_USERNAME
$NPM_PASSWORD
$NPM_EMAIL
EOF
