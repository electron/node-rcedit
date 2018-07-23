const assert = require('assert')
const fs = require('fs')
const path = require('path')
const rcedit = require('..')
const rcinfo = require('rcinfo')
var temp = require('temp').track()

var beforeEach = global.beforeEach
var describe = global.describe
var it = global.it

describe('rcedit(exePath, options, callback)', function () {
  this.timeout(60000)

  let exePath = null
  let tempPath = null

  beforeEach(() => {
    tempPath = temp.mkdirSync('node-rcedit-')
    exePath = path.join(tempPath, 'electron.exe')
    const fixturesExePath = path.join(__dirname, 'fixtures', 'electron.exe')
    fs.writeFileSync(exePath, fs.readFileSync(fixturesExePath))
  })

  it('updates the information in the executable', done => {
    const options = {
      'version-string': {
        CompanyName: 'Umbrella',
        FileDescription: 'Vanhouten',
        LegalCopyright: 'Maritime',
        ProductName: 'Millhouse'
      },
      'file-version': '3.4.5.6',
      'product-version': '4.5.6.7',
      icon: path.join(__dirname, 'fixtures', 'app.ico')
    }

    rcedit(exePath, options, error => {
      if (error != null) return done(error)

      rcinfo(exePath, (error, info) => {
        if (error != null) return done(error)

        assert.equal(info.CompanyName, 'Umbrella')
        assert.equal(info.FileDescription, 'Vanhouten')
        assert.equal(info.LegalCopyright, 'Maritime')
        assert.equal(info.ProductName, 'Millhouse')
        assert.equal(info.FileVersion, '3.4.5.6')
        assert.equal(info.ProductVersion, '4.5.6.7')

        done()
      })
    })
  })

  it('supports non-ASCII characters in the .exe path', done => {
    const unicodePath = path.join(path.dirname(exePath), 'äeiöü.exe')
    fs.renameSync(exePath, unicodePath)

    const options = {
      'version-string': {
        FileDescription: 'foo',
        ProductName: 'bar'
      },
      'file-version': '8.0.8'
    }

    rcedit(unicodePath, options, error => {
      if (error != null) return done(error)
      done()
    })
  })

  it('supports a product version of 1', done => {
    const options = { 'product-version': '1' }

    rcedit(exePath, options, error => {
      if (error != null) return done(error)

      rcinfo(exePath, (error, info) => {
        if (error != null) return done(error)

        assert.equal(info.ProductVersion, '1.0.0.0')
        done()
      })
    })
  })

  it('supports a product version of 1.0', done => {
    const options = { 'product-version': '1.0' }

    rcedit(exePath, options, error => {
      if (error != null) return done(error)

      rcinfo(exePath, (error, info) => {
        if (error != null) return done(error)

        assert.equal(info.ProductVersion, '1.0.0.0')
        done()
      })
    })
  })

  it('supports setting requestedExecutionLevel to requireAdministrator', done => {
    const options = { 'requested-execution-level': 'requireAdministrator' }

    // first read in the file and test that requireAdministrator is not present
    let text = fs.readFileSync(exePath, 'utf8')
    assert.equal(text.indexOf('requireAdministrator'), -1)

    rcedit(exePath, options, error => {
      if (error != null) return done(error)

      // read in the exe as text
      text = fs.readFileSync(exePath, 'utf8')

      assert.notEqual(text.indexOf('requireAdministrator'), -1)
      done()
    })
  })

  it('supports replacing the manifest with a specified manifest file', done => {
    const options = {
      'application-manifest': path.join(__dirname, 'fixtures', 'electron.manifest')
    }

    // first read in the file and test that requireAdministrator is not present
    let text = fs.readFileSync(exePath, 'utf8')
    assert.equal(text.indexOf('requireAdministrator'), -1)

    rcedit(exePath, options, error => {
      if (error != null) return done(error)

      // read in the exe as text
      text = fs.readFileSync(exePath, 'utf8')

      assert.notEqual(text.indexOf('requireAdministrator'), -1)
      done()
    })
  })

  it('reports an error when the .exe path does not exist', done => {
    rcedit(path.join(tempPath, 'does-not-exist.exe'), {'file-version': '3.4.5.6'}, error => {
      assert.ok(error instanceof Error)
      assert.notEqual(error.message.indexOf('rcedit.exe failed with exit code 1.'), -1)
      assert.notEqual(error.message.indexOf('Unable to load file'), -1)

      done()
    })
  })

  it('reports an error when the icon path does not exist', done => {
    rcedit(exePath, {icon: path.join(tempPath, 'does-not-exist.ico')}, error => {
      assert.ok(error instanceof Error)
      assert.notEqual(error.message.indexOf('Fatal error: Unable to set icon'), -1)

      done()
    })
  })

  it('reports an error when the file version is invalid', done => {
    rcedit(exePath, {'file-version': 'foo'}, error => {
      assert.ok(error instanceof Error)
      assert.notEqual(error.message.indexOf('Fatal error: Unable to parse version string for FileVersion'), -1)

      done()
    })
  })

  it('reports an error when the product version is invalid', done => {
    rcedit(exePath, {'product-version': 'foo'}, error => {
      assert.ok(error instanceof Error)
      assert.notEqual(error.message.indexOf('Fatal error: Unable to parse version string for ProductVersion'), -1)

      done()
    })
  })
})
