const _ = require('rubico')
const deepEqual = require('deep-equal')

const isDeepEqual = (x, y) => deepEqual(x, y, { strict: true })

const a = {}

const fmtType = x => {
  if (_.is('string')(x)) return `\'${x}\'`
  if (_.is('undefined')(x)) return 'undefined'
  if (x === null) return 'null'
  if (_.is(Set)(x)) return `Set(${Array.from(x).join(',')})`
  if (_.is(Map)(x)) return `Map(${_.stringifyJSON(_.entriesToObject(x))})`
  if (_.is(Buffer)(x)) return `Buffer('${_.toString(x)}')`
  if (_.is(Object)(x)) return _.stringifyJSON(x)
  return x
}

const fmtErrorMessage = (x, operator, y) => [
  fmtType(y),
  operator,
  fmtType(x),
].join(' ')

a.eq = (...fns) => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e)
  return async x => {
    const first = await _.toFn(fns[0])(x)
    let i = 1
    while (i < fns.length) {
      const next = await _.toFn(fns[i])(x)
      if (!isDeepEqual(first, next)) {
        const op = _.is(Object)(first) ? '!deepEqual' : '!=='
        e.message = fmtErrorMessage(first, op, next)
        throw e
      }
      i += 1
    }
    return x
  }
}

a.eq.sync = (...fns) => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e)
  return x => {
    const first = _.toFn(fns[0])(x)
    let i = 1
    while (i < fns.length) {
      const next = _.toFn(fns[i])(x)
      if (!isDeepEqual(first, next)) {
        const op = _.is(Object)(first) ? '!deepEqual' : '!=='
        e.message = fmtErrorMessage(first, op, next)
        throw e
      }
      i += 1
    }
    return x
  }
}

module.exports = a
