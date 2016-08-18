#!/bin/bash -xe

case "$TRAVIS_OS_NAME" in
  "linux")
    sudo apt-get update
    sudo apt-get install -y wine1.6
    ;;
  "osx")
    npm install wine-darwin@1.9.17-1
    # Setup ~/.wine by running a command
    ./node_modules/.bin/wine hostname
    ;;
esac
