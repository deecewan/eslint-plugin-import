import { test } from '../utils'

import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()
    , rule = require('rules/no-path-matching-pattern')

ruleTester.run('no-path-matching-pattern', rule, {
  valid: [
    test({ code: 'import f from "foo"' }),
    test({ code: 'require("foobar")' }),
    test({ code: 'define(["bar"], function (f) { /* ... */ })' }),
    test({ code: 'require("foo")', options: [{ patterns: ['bar'] }] }),
    test({ code: 'require("foobar")', options: [{ patterns: ['^bar'] }] }),
    test({ code: 'require("foo")', options: [{ commonjs: false, patterns: ['foo'] }] }),
    test({ code: 'require("foobar")', options: [{ patterns: ['foo$'] }] }),
    test({
      code: 'import foo from "barbell"',
      options: [{ esmodule: false, patterns: ['bar'] }],
    }),
  ],
  invalid: [
    test({
      code: 'import foo from "barbell"',
      options: [{ patterns: ['bar'] }],
      errors: [{
        message: 'Path is disallowed by /bar/.',
      }],
    }),
    test({
      code: 'import foo from "barbell"',
      options: [{ patterns: ['bell$'] }],
      errors: [{
        message: 'Path is disallowed by /bell$/.',
      }],
    }),
    test({
      code: 'import foo from "barbell"',
      options: [{ patterns: ['^bar', 'rbe', 'bell$'] }],
      errors: [{
        message: 'Path is disallowed by /^bar/, /rbe/, /bell$/.',
      }],
    }),
    test({
      code: 'require("foobar")',
      options: [{ patterns: ['bar'] }],
      errors: [{
        message: 'Path is disallowed by /bar/.',
      }],
    }),
    test({
      code: 'define(["foobar"], function (f) { /* ... */ })',
      options: [{ amd: true, patterns: ['bar'] }],
      errors: [{
        message: 'Path is disallowed by /bar/.',
      }],
    }),
  ],
})
