# node-rcedit

[![Test](https://github.com/electron/node-rcedit/actions/workflows/test.yml/badge.svg)](https://github.com/electron/node-rcedit/actions/workflows/test.yml)
[![NPM package](https://img.shields.io/npm/v/rcedit)](https://npm.im/rcedit)

Node module to edit resources of Windows executables.

## Requirements

On platforms other than Windows, you will need to have [Wine](https://winehq.org)
1.6 or later installed and in the system path.

> [!NOTE]
> Under the hood, this package relies on the [electron/rcedit](https://github.com/electron/rcedit)
> binary to perform operations. A vendored executable is in the `/bin/` folder of the source code.
> The latest version of this package uses `rcedit@2.0.0`.

## Usage

```javascript
import { rcedit } from 'rcedit'
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
  [requestedExecutionLevel](https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2015/deployment/trustinfo-element-clickonce-application?view=vs-2015#requestedexecutionlevel) for
  more details.
* `application-manifest` - String path to a local manifest file to use.
  See [Application manifest](https://learn.microsoft.com/en-us/windows/win32/sbscs/application-manifests)
  for more details.
* `resource-string` - An object in the form of `{ [id]: value }` to add to the
  [string table](https://docs.microsoft.com/en-us/windows/win32/menurc/stringtable-resource).

Returns a `Promise` with no value.

## Building

* Clone the repository
* Run `yarn install`
* Run `yarn test` to run the tests
