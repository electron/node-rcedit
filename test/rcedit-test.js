/* eslint-env node, mocha */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const rcedit = require('..')
const { canRunWindowsExeNatively, is64BitArch, spawnExe } = require('cross-spawn-windows-exe')
const temp = require('temp').track()

const copyFile = promisify(fs.copyFile)
const readFile = promisify(fs.readFile)

// Replicate the functionality of the rcinfo npm package using rcedit
async function rcinfo (exe) {
  const rceditExe = is64BitArch(process.arch) ? 'rcedit-x64.exe' : 'rcedit.exe'
  const rcedit = path.resolve(__dirname, '..', 'bin', rceditExe)

  const spawnOptions = {
    env: { ...process.env }
  }

  if (!canRunWindowsExeNatively()) {
    // Suppress "fixme:" stderr log messages
    spawnOptions.env.WINEDEBUG = '-all'
  }

  const getVersionString = (key) => spawnExe(rcedit, [exe, '--get-version-string', key], spawnOptions)

  return {
    CompanyName: await getVersionString('CompanyName'),
    FileDescription: await getVersionString('FileDescription'),
    LegalCopyright: await getVersionString('LegalCopyright'),
    ProductName: await getVersionString('ProductName'),
    FileVersion: await getVersionString('FileVersion'),
    ProductVersion: await getVersionString('ProductVersion')
  }
}

async function assertRceditError (exePath, options, messages) {
  try {
    await rcedit(exePath, options)
    assert.fail('should not succeed')
  } catch (error) {
    assert.ok(error instanceof Error)
    for (const message of messages) {
      assert.ok(error.message.includes(message), `Expected "${message}" in error message:\n${error.message}`)
    }
  }
}

describe('async rcedit(exePath, options)', function () {
  this.timeout(60000)

  let exePath = null
  let tempPath = null

  beforeEach(async () => {
    tempPath = temp.mkdirSync('node-rcedit-')
    exePath = path.join(tempPath, 'electron.exe')
    const fixturesExePath = path.join(__dirname, 'fixtures', 'electron.exe')
    await copyFile(fixturesExePath, exePath)
  })

  it('updates the information in the executable', async () => {
    await rcedit(exePath, {
      'version-string': {
        CompanyName: 'Umbrella',
        FileDescription: 'Vanhouten',
        LegalCopyright: 'Maritime',
        ProductName: 'Millhouse'
      },
      'file-version': '3.4.5.6',
      'product-version': '4.5.6.7',
      icon: path.join(__dirname, 'fixtures', 'app.ico')
    })
    const info = await rcinfo(exePath)

    assert.strictEqual(info.CompanyName, 'Umbrella')
    assert.strictEqual(info.FileDescription, 'Vanhouten')
    assert.strictEqual(info.LegalCopyright, 'Maritime')
    assert.strictEqual(info.ProductName, 'Millhouse')
    assert.strictEqual(info.FileVersion, '3.4.5.6')
    assert.strictEqual(info.ProductVersion, '4.5.6.7')
  })

  it('supports non-ASCII characters in the .exe path', async () => {
    const unicodePath = path.join(path.dirname(exePath), 'äeiöü.exe')
    await promisify(fs.rename)(exePath, unicodePath)

    await rcedit(unicodePath, {
      'version-string': {
        FileDescription: 'foo',
        ProductName: 'bar'
      },
      'file-version': '8.0.8'
    })
  })

  it('supports a product version of 1', async () => {
    await rcedit(exePath, { 'product-version': '1' })

    const info = await rcinfo(exePath)
    assert.strictEqual(info.ProductVersion, '1')
  })

  it('supports a product version of 1.0', async () => {
    await rcedit(exePath, { 'product-version': '1.0' })

    const info = await rcinfo(exePath)
    assert.strictEqual(info.ProductVersion, '1.0')
  })

  it('supports setting requestedExecutionLevel to requireAdministrator', async () => {
    let exeData = await readFile(exePath, 'utf8')
    assert.ok(!exeData.includes('requireAdministrator'))

    await rcedit(exePath, { 'requested-execution-level': 'requireAdministrator' })

    exeData = await readFile(exePath, 'utf8')
    assert.ok(exeData.includes('requireAdministrator'))
  })

  it('supports replacing the manifest with a specified manifest file', async () => {
    let exeData = await readFile(exePath, 'utf8')
    assert.ok(!exeData.includes('requireAdministrator'))

    await rcedit(exePath, { 'application-manifest': path.join(__dirname, 'fixtures', 'electron.manifest') })

    exeData = await readFile(exePath, 'utf8')
    assert.ok(exeData.includes('requireAdministrator'))
  })

  it('supports setting resource strings', async () => {
    let exeData = await readFile(exePath, 'utf16le')
    assert.ok(!exeData.includes('bonfire'))
    assert.ok(!exeData.includes('mumbai'))

    await rcedit(exePath, { 'resource-string': { 1: 'bonfire', 2: 'mumbai' } })

    exeData = await readFile(exePath, 'utf16le')
    assert.ok(exeData.includes('bonfire'))
    assert.ok(exeData.includes('mumbai'))
  })

  it('reports an error when the .exe path does not exist', async () => {
    await assertRceditError(path.join(tempPath, 'does-not-exist.exe'), { 'file-version': '3.4.5.6' }, [
      'Command failed with a non-zero return code (1)',
      'Unable to load file'
    ])
  })

  it('reports an error when the icon path does not exist', async () => {
    await assertRceditError(exePath, { icon: path.join(tempPath, 'does-not-exist.ico') }, [
      'Cannot open icon file',
      'Fatal error: Unable to set icon'
    ])
  })

  it('reports an error when the file version is invalid', async () => {
    await assertRceditError(exePath, { 'file-version': 'foo' }, ['Fatal error: Unable to parse version string for FileVersion'])
  })

  it('reports an error when the product version is invalid', async () => {
    await assertRceditError(exePath, { 'product-version': 'foo' }, ['Fatal error: Unable to parse version string for ProductVersion'])
  })
})
