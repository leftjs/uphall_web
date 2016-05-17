#!/usr/bin/env bash
export NODE_ENV=production PORT=7878
git reset --hard
git pull origin HEAD
npm install
pm2 stop uphall-web -f
pm2 start ./bin/www -n uphall-web
