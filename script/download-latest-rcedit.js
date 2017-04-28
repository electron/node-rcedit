#!/usr/bin/env node

const fs = require('fs')
const got = require('got')
const path = require('path')

const downloadURL = 'https://ci.appveyor.com/api/projects/Atom/rcedit/artifacts/Default/rcedit.exe?job=Image:%20Visual%20Studio%202015&branch=master'
const filePath = path.join(__dirname, '..', 'bin', 'rcedit.exe')

process.on('uncaughtException', (error) => {
  console.log('Dowload failed:', error.message)
})

got.stream(downloadURL).pipe(fs.createWriteStream(filePath))
