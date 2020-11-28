import { expectError } from 'tsd'
import * as rcedit from '..'

await rcedit('foo.exe', {})
await rcedit('foo.exe', { 'version-string': { CompanyName: 'FooCorp' }, 'requested-execution-level': 'requireAdministrator' })

expectError(await rcedit('foo.exe', { 'version-string': { UnknownProperty: 'asdf' } }))

expectError(await rcedit('foo.exe', { 'requested-execution-level': 'unknown' }))
