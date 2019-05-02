#!/usr/bin/env node

const fs = require('fs')
const got = require('got')
const path = require('path')

const downloadURL = 'https://ci.appveyor.com/api/projects/zcbenz/rcedit/artifacts/Default/rcedit-x86.exe?job=Platform:%20Win32'
const filePath = path.resolve(__dirname, '..', 'bin', 'rcedit.exe')

process.on('uncaughtException', error => {
  console.log('Downloading rcedit.exe failed:', error.message)
})

got.stream(downloadURL).pipe(fs.createWriteStream(filePath))
