#!/bin/bash

if [[ ! $BRANCH == "master" ]]; then
  echo "No deployment needed!";
fi

if [[ $BRANCH == "master" ]]; then
  # setup git stuff
  echo "Configuring git..."
  git config --global user.name "${USER_NAME}";
  git config --global user.email "${USER_EMAIL}";
  git remote set-url origin https://$GH_TOKEN@github.com/motorcyclejs/motorcyclejs;
  git fetch origin;
  git checkout master;
  git branch --set-upstream-to=origin/master master;

  echo "Logging in to NPM..."
  bash .scripts/npm-login.sh;

  echo "Building packages..."
  npm run build

  echo "Running release..."
  # run deployment
  northbrook release --skip-login --skip-tests --comver;
fi
