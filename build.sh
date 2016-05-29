#!/bin/sh

set -e

BUILD_DIR=`mktemp -dt ecmascript-spread-rest` || exit 1
trap "rm -rf $BUILD_DIR" EXIT
mkdir "$BUILD_DIR/out"

./node_modules/.bin/ecmarkup \
  Spec.html \
  "$BUILD_DIR/out/index.html" \
  --js "$BUILD_DIR/out/ecmarkup.js" \
  --css "$BUILD_DIR/out/ecmarkup.css"

# Replace gh-pages with a new commit without touching the working directory.
GIT_WORK_TREE="$BUILD_DIR/out" GIT_INDEX_FILE="$BUILD_DIR/index" \
  git add index.html ecmarkup.js ecmarkup.css
TREE=`GIT_WORK_TREE="$BUILD_DIR/out" GIT_INDEX_FILE="$BUILD_DIR/index" \
  git write-tree`
COMMIT=`git commit-tree "$TREE" -m 'build gh-pages'`
git branch -f gh-pages $COMMIT
