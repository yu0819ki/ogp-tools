#!/usr/bin/env sh

nodemon --exec "yarn install" -w yarn.lock &
nodemon server.js -e js
