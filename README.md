# node-rcedit

[![CircleCI build status](https://circleci.com/gh/electron/node-rcedit/tree/main.svg?style=shield)](https://circleci.com/gh/electron/node-rcedit/tree/main)
[![NPM package](https://img.shields.io/npm/v/rcedit)](https://npm.im/rcedit)

Node module to edit resources of Windows executables.

## Requirements

On platforms other than Windows, you will need to have [Wine](https://winehq.org)
1.6 or later installed and in the system path.

## Usage

```javascript
const rcedit = require('rcedit')
```

### `async rcedit(exePath, options)`

`exePath` is the path to the Windows executable to be modified.

`options` is an object that can contain following fields:

* `version-string` - An object containing properties to change the `exePath`'s
  version string.
* `file-version` - File's version to change to.
* `product-version` - Product's version to change to.
* `icon` - Path to the icon file (`.ico`) to set as the `exePath`'s default icon.
* `requested-execution-level` - Requested execution level to change to, must be
  either `asInvoker`, `highestAvailable`, or `requireAdministrator`. See
  [here](https://msdn.microsoft.com/en-us/library/6ad1fshk.aspx#Anchor_9) for
  more details.
* `application-manifest` - String path to a local manifest file to use.
  See [here](https://msdn.microsoft.com/en-us/library/windows/desktop/aa374191.aspx)
  for more details.
* `resource-string` - An object in the form of `{ [id]: value }` to add to the
  [string table](https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable-resource).

Returns a `Promise` with no value.

## Building

* Clone the repository
* Run `yarn install`
* Run `yarn test` to run the tests
