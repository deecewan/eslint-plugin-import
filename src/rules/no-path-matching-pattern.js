import moduleVisitor, { makeOptionsSchema } from 'eslint-module-utils/moduleVisitor'
import docsUrl from '../docsUrl'

module.exports = {
  meta: {
    docs: {
      url: docsUrl('no-path-match-pattern'),
    },
    schema: [ makeOptionsSchema({ patterns: { type: 'array', items: { type: 'string' } } }) ],
  },

  create: function (context) {
    if (!context.options[0] || !context.options[0].patterns) {
      // we don't need to check anything - there are no patterns to verify
      return {}
    }
    const patterns = context.options[0].patterns.map(pattern => new RegExp(pattern))
    function reportIfMatchesPattern(source) {
      const invalid = patterns.filter(pattern => pattern.test(source.value))
      if (invalid.length > 0) {
        const matched = invalid.map(i => i.toString()).join(', ')
        context.report(source, `Path is disallowed by ${matched}.`)
      }
    }

    const options = Object.assign({ esmodule: true, commonjs: true }, context.options[0])
    return moduleVisitor(reportIfMatchesPattern, options)
  },
}