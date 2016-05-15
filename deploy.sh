#!/usr/bin/env bash
git reset --hard
git pull origin HEAD
npm install
npm run dist
pm2 stop uphall-web -f
pm2 start ./server.js --node-args="--env=dev" -n uphall-web
