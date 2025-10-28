#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import got from 'got'

const downloadURL32 = 'https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x86.exe'
const filePath32 = path.resolve(import.meta.dirname, '..', 'bin', 'rcedit.exe')

const downloadURL64 = 'https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x64.exe'
const filePath64 = path.resolve(import.meta.dirname, '..', 'bin', 'rcedit-x64.exe')

process.on('uncaughtException', error => {
  console.log('Downloading rcedit executables failed:', error.message)
})

got.stream(downloadURL32).pipe(fs.createWriteStream(filePath32))
got.stream(downloadURL64).pipe(fs.createWriteStream(filePath64))
