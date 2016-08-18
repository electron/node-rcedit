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

  beforeEach(function () {
    exePath = path.join(temp.mkdirSync('node-rcedit-'), 'electron.exe')
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
      'product-version': '4.5.6.7'
    }
    rcedit(exePath, options, function (error) {
      if (error != null) return done(error)

      rcinfo(exePath, function (error, info) {
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
})
