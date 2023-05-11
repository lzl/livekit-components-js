#!/bin/bash

VERSION=$(cat package.json | grep version | head -1 | awk -F: '{print $2}' | sed 's/[", ]//g')
LAST_NUM=$(echo "${VERSION: -1}")
UPDATED_LAST_NUM=$((LAST_NUM+1))
UPDATED_VERSION=${VERSION:0:${#VERSION}-1}$UPDATED_LAST_NUM
sed -i -e "s/$VERSION/$UPDATED_VERSION/g" package.json
yalc push
echo "pushed version $UPDATED_VERSION"
