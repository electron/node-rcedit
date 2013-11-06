path = require 'path'
{spawn} = require 'child_process'

pairSettings = ['version-string']
singleSettings = ['file-version', 'product-version', 'icon']

module.exports = (exe, options, callback) ->
  rcedit = path.resolve __dirname, '..', 'bin', 'rcedit.exe'
  args = [exe]

  for name in pairSettings
    if options[name]?
      for key, value of options[name]
        args.push "--set-#{name}"
        args.push key
        args.push value

  for name in singleSettings
    if options[name]?
      args.push "--set-#{name}"
      args.push options[name]

  child = spawn rcedit, args

  stderr = ''
  child.stderr.on 'data', (data) -> stderr += data
  child.on 'close', (code) ->
    if code is 0
      callback null
    else
      callback stderr
