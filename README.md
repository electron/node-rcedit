# node-rcedit

Node module to edit resources of Windows executables.

## Building

* Clone the repository
* Run `npm install`
* Run `grunt` to compile the CoffeeScript code

## Docs

```coffeescript
rcedit = require 'rcedit'
```
On platforms other then Windows you will need to have [Wine](http://winehq.org) installed and in the system path.

### `rcedit(exePath, options, callback)`

`exePath` is the path to the Windows executable to be modified.

`options` is an object that can contain following fields:

* `version-string` - An object containing properties to change the `exePath`'s
  version string.
* `file-version` - File's version to change to.
* `product-version` - Product's version to change to.
* `icon` - Path to the icon file (`.ico`) to set as the `exePath`'s default icon.

`callback` is the `Function` called when the command completes. The function
signature is `function (error)`.
