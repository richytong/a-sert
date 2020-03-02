const a = require('.')
const assert = require('assert')

const newAssertionError = message => {
  const e = new Error()
  e.name = 'AssertionError'
  e.message = message
  return e
}

describe('a-sert', () => {
  describe('a.eq', () => {
    it('passes args along for strict equality', async () => {
      a.eq(1, x => x.a)({ a: 1 })
      a.eq(0, x => x.a)({ a: 0 })
      a.eq('hey', x => x.a)({ a: 'hey' })
      a.eq('', x => x.a)({ a: '' })
      a.eq(false, x => x.a)({ a: false })
      a.eq(undefined, x => x.a)({ a: undefined })
      a.eq(undefined, x => x.a)({})
      a.eq(null, x => x.a)({ a: null })
    })

    it('throws AssertionError on not strict equal', async () => {
      assert.rejects(
        () => a.eq(0, x => x.a)({ a: 1 }),
        newAssertionError('1 !== 0'),
      )
      assert.rejects(
        () => a.eq('hey', x => x.a)({ a: 'ho' }),
        newAssertionError('\'ho\' !== \'hey\''),
      )
      assert.rejects(
        () => a.eq('', x => x.a)({ a: 'hey' }),
        newAssertionError('\'hey\' !== \'\''),
      )
    })

    it('passes args along on deep equality', async () => {
      a.eq({ a: 1 }, x => x)({ a: 1 })
      a.eq([1, 2, 3], x => x)([1, 2, 3])
      a.eq(new Set([1, 2, 3]), x => x)(new Set([1, 2, 3]))
      a.eq(new Map([['a', 1]]), x => x)(new Map([['a', 1]]))
      a.eq(Buffer.from('hey'), x => x)(Buffer.from('hey'))
    })

    it('throws AssertionError on not deep equal', async () => {
      assert.rejects(
        () => a.eq({ a: 1 }, x => x)({ a: 2 }),
        newAssertionError('{"a":2} !deepEqual {"a":1}'),
      )
      assert.rejects(
        () => a.eq([1, 2, 3], x => x)([4, 5, 6]),
        newAssertionError('[4,5,6] !deepEqual [1,2,3]'),
      )
    })
  })

  describe('a.eq.sync', () => {
    it('syncly passes args along for strict equality', async () => {
      a.eq.sync(1, x => x.a)({ a: 1 })
      a.eq.sync(0, x => x.a)({ a: 0 })
      a.eq.sync('hey', x => x.a)({ a: 'hey' })
      a.eq.sync('', x => x.a)({ a: '' })
      a.eq.sync(false, x => x.a)({ a: false })
      a.eq.sync(undefined, x => x.a)({ a: undefined })
      a.eq.sync(undefined, x => x.a)({})
      a.eq.sync(null, x => x.a)({ a: null })
    })

    it('throws AssertionError on not strict equal', async () => {
      assert.throws(
        () => a.eq.sync(false, x => x.a)({ a: true }),
        newAssertionError('true !== false'),
      )
      assert.throws(
        () => a.eq.sync(undefined, x => x.a)({ a: false }),
        newAssertionError('false !== undefined'),
      )
      assert.throws(
        () => a.eq.sync(null, x => x.a)({ a: false }),
        newAssertionError('false !== null'),
      )
    })

    it('syncly passes args along on deep equality', async () => {
      a.eq.sync({ a: 1 }, x => x)({ a: 1 })
      a.eq.sync([1, 2, 3], x => x)([1, 2, 3])
      a.eq.sync(new Set([1, 2, 3]), x => x)(new Set([1, 2, 3]))
      a.eq.sync(new Map([['a', 1]]), x => x)(new Map([['a', 1]]))
      a.eq.sync(Buffer.from('hey'), x => x)(Buffer.from('hey'))
    })

    it('syncly throws AssertionError on not deep equal', async () => {
      assert.throws(
        () => a.eq.sync(new Set([1, 2, 3]), x => x)(new Set([4, 5, 6])),
        newAssertionError('Set(4,5,6) !deepEqual Set(1,2,3)'),
      )
      assert.throws(
        () => a.eq.sync(Buffer.from('hey'), x => x)(Buffer.from('ho')),
        newAssertionError('Buffer(\'ho\') !deepEqual Buffer(\'hey\')'),
      )
    })
  })

  describe('a.err', () => {
    it('expects an error', async () => {
      assert.rejects(
        () => a.err(
          new Error('yo'),
          x => x,
        )(1),
        newAssertionError('did not throw Error: yo'),
      )
    })

    it('asserts error name', async () => {
      assert.rejects(
        () => a.err(
          new RangeError('hey'),
          () => { throw new TypeError('hey') },
        )(1),
        newAssertionError('TypeError thrown; expected RangeError'),
      )
    })

    it('asserts error message', async () => {
      assert.rejects(
        () => a.err(
          new TypeError('ho'),
          () => { throw new TypeError('hey') },
        )(1),
        newAssertionError([
          'TypeError correctly thrown with wrong message',
          '\n       expect: ho',
          '\n       thrown: hey',
        ].join(''))
      )
    })
  })

  describe('a.err.sync', () => {
    it('expects a sync error', async () => {
      assert.throws(
        () => a.err.sync(
          new Error('yo'),
          x => x,
        )(1),
        newAssertionError('did not throw Error: yo'),
      )
    })

    it('syncly asserts error name', async () => {
      assert.throws(
        () => a.err.sync(
          new RangeError('hey'),
          () => { throw new TypeError('hey') },
        )(1),
        newAssertionError('TypeError thrown; expected RangeError'),
      )
    })

    it('syncly asserts error message', async () => {
      assert.throws(
        () => a.err.sync(
          new TypeError('ho'),
          () => { throw new TypeError('hey') },
        )(1),
        newAssertionError([
          'TypeError correctly thrown with wrong message',
          '\n       expect: ho',
          '\n       thrown: hey',
        ].join(''))
      )
    })
  })
})
