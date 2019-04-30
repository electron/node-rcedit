var assert = require('assert')
var fs = require('fs')
var path = require('path')
var rcedit = require('..')
var rcinfo = require('rcinfo')
var temp = require('temp').track()

var beforeEach = global.beforeEach
var describe = global.describe
var it = global.it

describe('rcedit(exePath, options, callback)', function () {
  this.timeout(60000)

  var exePath = null
  var tempPath = null

  beforeEach(function () {
    tempPath = temp.mkdirSync('node-rcedit-')
    exePath = path.join(tempPath, 'electron.exe')
    var fixturesExePath = path.join(__dirname, 'fixtures', 'electron.exe')
    fs.writeFileSync(exePath, fs.readFileSync(fixturesExePath))
  })

  it('updates the information in the executable', function (done) {
    var options = {
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

    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      rcinfo(exePath, function (error, info) {
        if (error != null) return done(error)

        assert.strictEqual(info.CompanyName, 'Umbrella')
        assert.strictEqual(info.FileDescription, 'Vanhouten')
        assert.strictEqual(info.LegalCopyright, 'Maritime')
        assert.strictEqual(info.ProductName, 'Millhouse')
        assert.strictEqual(info.FileVersion, '3.4.5.6')
        assert.strictEqual(info.ProductVersion, '4.5.6.7')

        done()
      })
    })
  })

  it('supports non-ASCII characters in the .exe path', function (done) {
    var unicodePath = path.join(path.dirname(exePath), 'äeiöü.exe')
    fs.renameSync(exePath, unicodePath)

    var options = {
      'version-string': {
        FileDescription: 'foo',
        ProductName: 'bar'
      },
      'file-version': '8.0.8'
    }

    rcedit(unicodePath, options, function (error) {
      if (error != null) return done(error)
      done()
    })
  })

  it('supports a product version of 1', function (done) {
    var options = {
      'product-version': '1'
    }

    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      rcinfo(exePath, function (error, info) {
        if (error != null) return done(error)

        assert.strictEqual(info.ProductVersion, '1.0.0.0')

        done()
      })
    })
  })

  it('supports a product version of 1.0', function (done) {
    var options = {
      'product-version': '1.0'
    }

    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      rcinfo(exePath, function (error, info) {
        if (error != null) return done(error)

        assert.strictEqual(info.ProductVersion, '1.0.0.0')

        done()
      })
    })
  })

  it('supports setting requestedExecutionLevel to requireAdministrator', function (done) {
    var options = {
      'requested-execution-level': 'requireAdministrator'
    }

    // first read in the file and test that requireAdministrator is not present
    var text = fs.readFileSync(exePath, 'utf8')
    assert.strictEqual(text.indexOf('requireAdministrator'), -1)

    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      // read in the exe as text
      text = fs.readFileSync(exePath, 'utf8')

      assert.notStrictEqual(text.indexOf('requireAdministrator'), -1)

      done()
    })
  })

  it('supports replacing the manifest with a specified manifest file', function (done) {
    var options = {
      'application-manifest': path.join(__dirname, 'fixtures', 'electron.manifest')
    }

    // first read in the file and test that requireAdministrator is not present
    var text = fs.readFileSync(exePath, 'utf8')
    assert.strictEqual(text.indexOf('requireAdministrator'), -1)

    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      // read in the exe as text
      text = fs.readFileSync(exePath, 'utf8')

      assert.notStrictEqual(text.indexOf('requireAdministrator'), -1)

      done()
    })
  })

  it('reports an error when the .exe path does not exist', function (done) {
    rcedit(path.join(tempPath, 'does-not-exist.exe'), { 'file-version': '3.4.5.6' }, function (error) {
      assert.ok(error instanceof Error)
      assert.notStrictEqual(error.message.indexOf('rcedit.exe failed with exit code 1.'), -1)
      assert.notStrictEqual(error.message.indexOf('Unable to load file'), -1)

      done()
    })
  })

  it('reports an error when the icon path does not exist', function (done) {
    rcedit(exePath, { icon: path.join(tempPath, 'does-not-exist.ico') }, function (error) {
      assert.ok(error instanceof Error)
      assert.notStrictEqual(error.message.indexOf('Fatal error: Unable to set icon'), -1)

      done()
    })
  })

  it('reports an error when the file version is invalid', function (done) {
    rcedit(exePath, { 'file-version': 'foo' }, function (error) {
      assert.ok(error instanceof Error)
      assert.notStrictEqual(error.message.indexOf('Fatal error: Unable to parse version string for FileVersion'), -1)

      done()
    })
  })

  it('reports an error when the product version is invalid', function (done) {
    rcedit(exePath, { 'product-version': 'foo' }, function (error) {
      assert.ok(error instanceof Error)
      assert.notStrictEqual(error.message.indexOf('Fatal error: Unable to parse version string for ProductVersion'), -1)

      done()
    })
  })
})
