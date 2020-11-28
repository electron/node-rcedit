declare function rcedit (exe: string, options: rcedit.Options): Promise<void>

/* eslint-disable-next-line no-redeclare */
declare namespace rcedit {
  /** See [MSDN](https://msdn.microsoft.com/en-us/library/6ad1fshk.aspx#Anchor_9) for details. */
  type RequestedExecutionLevel = 'asInvoker' | 'highestAvailable' | 'requireAdministrator'
  interface VersionStringOptions {
    CompanyName?: string
    FileDescription?: string
    InternalFilename?: string
    OriginalFilename?: string
    ProductName?: string
  }
  interface Options {
    'version-string'?: VersionStringOptions
    'file-version'?: string
    'product-version'?: string
    icon?: string
    'requested-execution-level'?: RequestedExecutionLevel
    'application-manifest'?: string
  }
}

export = rcedit
