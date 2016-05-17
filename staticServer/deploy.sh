#!/usr/bin/env bash
git reset --hard
git pull origin HEAD
npm install
pm2 stop uphall-web -f
pm2 start ./bin/www -n uphall-web
