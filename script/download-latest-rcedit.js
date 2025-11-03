#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'

const downloadURL32 = 'https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x86.exe'
const filePath32 = path.resolve(import.meta.dirname, '..', 'bin', 'rcedit.exe')

const downloadURL64 = 'https://github.com/electron/rcedit/releases/download/v2.0.0/rcedit-x64.exe'
const filePath64 = path.resolve(import.meta.dirname, '..', 'bin', 'rcedit-x64.exe')

process.on('uncaughtException', error => {
  console.log('Downloading rcedit executables failed:', error.message)
})

async function download (url, filePath) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(filePath))
}

await Promise.all([
  download(downloadURL32, filePath32),
  download(downloadURL64, filePath64)
])
