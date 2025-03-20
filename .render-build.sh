#!/usr/bin/env bash
# Install client dependencies and build React app
cd client
npm install
npm run build
cd ..

# Install server dependencies
npm install
