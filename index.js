const _ = require('rubico')

const a = {}

a.eq = (...fns) => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e)
  return x => {
    const fns0 = _.toFn(fns[0])
    const first = _.toFn(fns[0])(x)
    let i = 1
    while (i < fns.length) {
      const next = _.toFn(fns[i])(x)
      if (first !== next) {
        e.message = `Expected ${next} === ${first}`
        throw e
      }
      i += 1
    }
    return x
  }
}

module.exports = a
