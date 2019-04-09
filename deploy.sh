#!/bin/bash -e

git config --global user.name "Circle CI"
git config --global user.email "<>"
git checkout -b gh-pages origin/gh-pages
git pull origin master --no-edit

npm install

npm run build

if [ "$(git status --porcelain | wc -l | xargs)" -eq 0 ]; then
  echo "Not exist deploying contents."
  exit 0
fi

git add -A
git commit -m "[ci skip] Deploy by CI"

git push -f $(git config --get remote.origin.url) gh-pages > /dev/null/ 2>&1

echo "Deploy a site!"

cd -