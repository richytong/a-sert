const _ = require('rubico')
const deepEqual = require('deep-equal')

const isDeepEqual = (x, y) => deepEqual(x, y, { strict: true })

const a = {}

a.ok = fn => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e, a.ok)
  fn = _.toFn(fn)
  const ret = async x => {
    if (!(await fn(x))) {
      e.message = `not ok: (${_.shorthand(fn)})(${_.shorthand(x)})`
      throw e
    }
  }
  _.setName(ret, `a.ok(${_.shorthand(fn)})`)
  return ret
}
_.setName(a.ok, 'a-sert.ok')

a.ok.sync = fn => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e, a.ok)
  fn = _.toFn(fn)
  const ret = x => {
    if (!fn(x)) {
      e.message = `not ok: (${_.shorthand(fn)})(${_.shorthand(x)})`
      throw e
    }
  }
  _.setName(ret, `a.ok(${_.shorthand(fn)})`)
  return ret
}
_.setName(a.ok.sync, 'a-sert.ok')

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
  Error.captureStackTrace(e, a.eq)
  fns = fns.map(_.toFn)
  const ret = async x => {
    const first = await fns[0](x)
    let i = 1
    while (i < fns.length) {
      const next = await fns[i](x)
      if (!isDeepEqual(first, next)) {
        const op = fmtOp(first)
        e.message = fmtErrorMessage(first, op, next)
        throw e
      }
      i += 1
    }
    return x
  }
  _.setName(ret, `a-sert.eq(${fns.map(_.getName).join(', ')})`)
  return ret
}
_.setName(a.eq, 'a-sert.eq')

a.eq.sync = (...fns) => {
  const e = new Error()
  e.name = 'AssertionError'
  Error.captureStackTrace(e, a.eq.sync)
  fns = fns.map(_.toFn)
  const ret = x => {
    const first = fns[0](x)
    let i = 1
    while (i < fns.length) {
      const next = fns[i](x)
      if (!isDeepEqual(first, next)) {
        const op = fmtOp(first)
        e.message = fmtErrorMessage(first, op, next)
        throw e
      }
      i += 1
    }
    return x
  }
  _.setName(ret, `a-sert.eq(${fns.map(_.getName).join(', ')})`)
  return ret
}
_.setName(a.eq.sync, 'a-sert.eq')

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

a.err = (fn, ee) => {
  const ae = new Error()
  ae.name = 'AssertionError'
  Error.captureStackTrace(ae, a.err)
  const ret = async x => {
    try {
      await fn(x)
    } catch (fe) {
      handleErrorExpectations(ae, ee, fe)
      return x
    }
    ae.message = `did not throw ${ee}`
    throw ae
  }
  _.setName(ret, `a-sert.err(${_.getName(ee)}, ${_.getName(fn)})`)
  return ret
}
_.setName(a.err, 'a-sert.err')

a.err.sync = (fn, ee) => {
  const ae = new Error()
  ae.name = 'AssertionError'
  Error.captureStackTrace(ae, a.err.sync)
  const ret = x => {
    try {
      fn(x)
    } catch (fe) {
      handleErrorExpectations(ae, ee, fe)
      return x
    }
    ae.message = `did not throw ${ee}`
    throw ae
  }
  _.setName(ret, `a-sert.err(${_.getName(ee)}, ${_.getName(fn)})`)
  return ret
}
_.setName(a.err.sync, 'a-sert.err')

module.exports = a
