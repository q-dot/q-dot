#!/bin/bash

echo Deploying will add ignored files needed for webpack to run on Heroku.
echo This will add all unstaged changes and create a commit to push to Heroku.
echo Existing 'deployToHeroku' branch will be force deleted and a new one created.
read -p "Continue? [yn] " answer
if [[ $answer = y ]]; then
  echo Running deployment script
  git branch -d deployToHeroku
  git checkout -b deployToHeroku
  git add .
  git add --force node_modules/
  git add --force server/config/config.js
  git commit -m "Preparing to deploy to Heroku"
  git status
  git push staging deployToHeroku:master --force
  curl -X POST http://q-deux-staging.herokuapp.com/dummydata
  git branch
else
  echo Cancelled deployment script
fi
