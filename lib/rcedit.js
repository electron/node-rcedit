const path = require('path')
const {spawn} = require('child_process')

const pairSettings = ['version-string']
const singleSettings = ['file-version', 'product-version', 'icon', 'requested-execution-level']
const noPrefixSettings = ['application-manifest']

module.exports = (exe, options, callback) => {
  let rcedit = path.resolve(__dirname, '..', 'bin', 'rcedit.exe')
  const args = [exe]

  pairSettings.forEach(name => {
    if (options[name] != null) {
      for (let key in options[name]) {
        const value = options[name][key]
        args.push('--set-' + name)
        args.push(key)
        args.push(value)
      }
    }
  })

  singleSettings.forEach(name => {
    if (options[name] != null) {
      args.push(`--set-${name}`)
      args.push(options[name])
    }
  })

  noPrefixSettings.forEach(name => {
    if (options[name] != null) {
      args.push(`--${name}`)
      args.push(options[name])
    }
  })

  const spawnOptions = {}
  spawnOptions.env = Object.create(process.env)

  if (process.platform !== 'win32') {
    args.unshift(rcedit)
    rcedit = 'wine'
    // Supress fixme: stderr log messages
    spawnOptions.env.WINEDEBUG = '-all'
  }

  const child = spawn(rcedit, args, spawnOptions)
  let stderr = ''
  let error = null

  child.on('error', err => {
    if (error == null) {
      error = err
    }
  })

  child.stderr.on('data', data => { stderr += data })

  child.on('close', code => {
    if (error != null) {
      callback(error)
    } else if (code === 0) {
      callback()
    } else {
      let message = `rcedit.exe failed with exit code ${code}`
      stderr = stderr.trim()
      if (stderr) message += `. ${stderr}`
      callback(new Error(message))
    }
  })
}
