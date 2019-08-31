#!/usr/bin/env node

const fs = require('fs')
const got = require('got')
const path = require('path')

const downloadURL32 = 'https://ci.appveyor.com/api/projects/zcbenz/rcedit/artifacts/Default/rcedit-x86.exe?job=Platform:%20Win32'
const filePath32 = path.resolve(__dirname, '..', 'bin', 'rcedit.exe')

const downloadURL64 = 'https://ci.appveyor.com/api/projects/zcbenz/rcedit/artifacts/Default/rcedit-x64.exe?job=Platform:%20x64'
const filePath64 = path.resolve(__dirname, '..', 'bin', 'rcedit-x64.exe')

process.on('uncaughtException', error => {
  console.log('Downloading rcedit executables failed:', error.message)
})

got.stream(downloadURL32).pipe(fs.createWriteStream(filePath32))
got.stream(downloadURL64).pipe(fs.createWriteStream(filePath64))
