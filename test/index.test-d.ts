import { expectError } from 'tsd'
import rcedit from '..'

await rcedit('foo.exe', {})
await rcedit('foo.exe', { 'version-string': { CompanyName: 'FooCorp' }, 'requested-execution-level': 'requireAdministrator' })

// @ts-expect-error tests
expectError(await rcedit('foo.exe', { 'version-string': { UnknownProperty: 'asdf' } }))

// @ts-expect-error tests
expectError(await rcedit('foo.exe', { 'requested-execution-level': 'unknown' }))
