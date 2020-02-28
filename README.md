# a-sert
☑ functional assertions

## Why?
- I like functional programming
- I never use `assert.equal`
- I hardly test for internal reference equality
- `assert` methods are too long to type

## Methods
`a.eq` - takes values or functions that transform the input  
then checks for strict or deep equality of their computed values

`a.eq.sync` - same as above but all functions must be sync

`a.err` - checks that a provided function throws or rejects  
a provided error

`a.err.sync` - same as above but provided function must be sync

## Examples
Basic usage
```javascript
const a = require('a-sert')

a.eq(1, x => x.a, x => x.b - 1)({ a: 1, b: 2 })
// => ({ a: 1 }, { b: 2 })

a.eq(1, x => x.a)({ a: 2 })
// throws AssertionError('2 !== 1')

a.eq(x => x, { a: 1 })({ a: 1 })
// => ({ a: 1 })

a.eq(x => x, { a: 1 })({ a: 2 })
// throws AssertionError('{"a":1} !deepEqual {"a":2}')

a.err(
  () => { throw new TypeError('hey') },
  new TypeError('hey'),
)('yo')
// => 'yo'

a.err(
  x => x,
  new RangeError('hey'),
)('yo')
// => throws AssertionError('did not throw RangeError: hey')
```

A test in mocha
```javascript
const _ = require('rubico')
const a = require('a-sert')
const connectorDynamo = require('.')

describe('connectorDynamo', () => {
  it('instantiates a DynamoDB client', () => _.flow(
    connectorDynamo,
    a.eq('localhost', _.get('client.endpoint.hostname')),
    a.eq('http:', _.get('client.endpoint.protocol')),
    a.eq(8000, _.get('client.endpoint.port')),
  )({
    endpoint: 'http://localhost:8000',
    credentials: {
      access_key_id: 'hey',
      secret_access_key: 'secret',
    },
    region: 'us-east-1',
  }))
})
```
