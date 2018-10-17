# import/no-path-matching-pattern: Forbid imports that match a regular expression

Some projects want to forbid the import of certain modules. This could be to stop using 'private' modules, or to prevent the usage of certain NPM packages.

## Rule Details

By default, this rule will never fail. It must have patterns specified to warn for.

### Options

By default, only ES6 imports and CommonJS `require` calls will have this rule enforced.

You may provide an options object providing true/false for any of

- `esmodule`: defaults to `true`
- `commonjs`: defaults to `true`
- `amd`: defaults to `false`
- `patterns`: defaults to `[]`

A pattern is a string that looks like a regular expression. At it's simplest, passing a plain string will warn if it appears *anywhere* in the import path.

```js
/* eslint import/no-path-matching-pattern: [2, { patterns: ['foobar'] }] */
import foo from 'foobar'; // reported
require('foobarbaz'); // reported
import bar from from 'foob'; // ignored because doesn't match /foobar/
```

You may specify as many patterns as you like:

```js
/* eslint import/no-path-matching-pattern: [2, { patterns: ['^foo', 'bar$'] }] */
import foo from 'foobar'; // reported for both
import bar from 'bar'; // reported
import f from 'foo'; // reported
import baz from 'barfoo'; // not reported
```

You can also enable `amd` to check for AMD requires:

```js
/* eslint import/no-path-matching-pattern: [2, { amd: true, commonjs: false, patterns: ['foobar'] }] */
import foo from 'foobar'; // reported for implicitly enabled esmodule
require('foobar'); // ignored for explicitly disable commonjs
define(['foobar'], function (f) { /* ... */ }); // reported for explicitly enabled AMD
```