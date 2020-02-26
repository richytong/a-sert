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
      assert.throws(
        () => a.eq(0, x => x.a)({ a: 1 }),
        newAssertionError('1 !== 0'),
      )
      assert.throws(
        () => a.eq('hey', x => x.a)({ a: 'ho' }),
        newAssertionError('\'ho\' !== \'hey\''),
      )
      assert.throws(
        () => a.eq('', x => x.a)({ a: 'hey' }),
        newAssertionError('\'hey\' !== \'\''),
      )
      assert.throws(
        () => a.eq(false, x => x.a)({ a: true }),
        newAssertionError('true !== false'),
      )
      assert.throws(
        () => a.eq(undefined, x => x.a)({ a: false }),
        newAssertionError('false !== undefined'),
      )
      assert.throws(
        () => a.eq(null, x => x.a)({ a: false }),
        newAssertionError('false !== null'),
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
      assert.throws(
        () => a.eq({ a: 1 }, x => x)({ a: 2 }),
        newAssertionError('{"a":2} !deepEqual {"a":1}'),
      )
      assert.throws(
        () => a.eq([1, 2, 3], x => x)([4, 5, 6]),
        newAssertionError('[4,5,6] !deepEqual [1,2,3]'),
      )
      assert.throws(
        () => a.eq(new Set([1, 2, 3]), x => x)(new Set([4, 5, 6])),
        newAssertionError('Set(4,5,6) !deepEqual Set(1,2,3)'),
      )
      assert.throws(
        () => a.eq(Buffer.from('hey'), x => x)(Buffer.from('ho')),
        newAssertionError('Buffer(\'ho\') !deepEqual Buffer(\'hey\')'),
      )
    })
  })
})
