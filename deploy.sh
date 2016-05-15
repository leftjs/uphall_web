#!/usr/bin/env bash
git reset --hard
git pull origin HEAD
npm install
npm run dist
pm2 stop uphall -f
pm2 start ./dist/index.js --node-args="--env=dist" -n uphall
