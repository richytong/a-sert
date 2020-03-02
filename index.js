const _ = require('rubico')
const deepEqual = require('deep-equal')

const isDeepEqual = (x, y) => deepEqual(x, y, { strict: true })

const a = {}

const fmtType = x => {
  if (x === undefined) return 'undefined'
  if (x === null) return 'null'
  if (_.isString(x)) return `\'${x}\'`
  if (_.isArray(x)) return `[${Array.from(x).join(',')}]`
  if (_.isSet(x)) return `Set(${Array.from(x).join(',')})`
  if (_.isMap(x)) return `Map(${JSON.stringify(Object.fromEntries(x))})`
  if (_.isBuffer(x)) return `Buffer('${_.toString(x)}')`
  if (_.isObject(x)) return JSON.stringify(x)
  return x
}

const fmtOp = x => {
  if (x === undefined) return '!=='
  if (x === null) return '!=='
  if (_.isString(x)) return '!=='
  if (_.isNumber(x)) return '!=='
  if (_.isBoolean(x)) return '!=='
  return '!deepEqual'
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
        const op = fmtOp(first)
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
        const op = fmtOp(first)
        e.message = fmtErrorMessage(first, op, next)
        throw e
      }
      i += 1
    }
    return x
  }
}

const handleErrorExpectations = (ae, ee, fe) => {
  if (fe.name !== ee.name) {
    ae.message = `${fe.name} thrown; expected ${ee.name}`
    throw ae
  }
  if (fe.message !== ee.message) {
    ae.message = [
      `${fe.name} correctly thrown with wrong message`,
      `\n       expect: ${ee.message}`,
      `\n       thrown: ${fe.message}`,
    ].join('')
    throw ae
  }
}

a.err = (ee, fn) => {
  const ae = new Error()
  ae.name = 'AssertionError'
  Error.captureStackTrace(ae)
  return async x => {
    try {
      await fn(x)
    } catch (fe) {
      handleErrorExpectations(ae, ee, fe)
      return x
    }
    ae.message = `did not throw ${ee}`
    throw ae
  }
}

a.err.sync = (ee, fn) => {
  const ae = new Error()
  ae.name = 'AssertionError'
  Error.captureStackTrace(ae)
  return x => {
    try {
      fn(x)
    } catch (fe) {
      handleErrorExpectations(ae, ee, fe)
      return x
    }
    ae.message = `did not throw ${ee}`
    throw ae
  }
}

module.exports = a
