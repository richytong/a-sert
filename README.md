# a-sert
✅ functional assertions

## Why?
- I like functional programming
- I never use `assert.equal`
- I hardly test for internal reference equality
- `assert` methods are too long to type

## Methods
`a.eq` - checks for strict or deep equality based on type  
`a.neq` - not `a.eq`

## Examples
Import this module like `const a = require('a-sert')`

`a.eq`
```javascript
a.eq(1, x => x.a)({ a: 1 })
// => ({ a: 1 })

a.eq(1, x => x.a)({ a: 2 })
// throws AssertionError('Expected 1 === 2')

a.eq(x => x, { a: 1 })({ a: 1 })
// => ({ a: 1 })

a.eq(x => x, { a: 1 })({ a: 2 })
// throws AssertionError('Expected { a: 2 } deepEqual { a: 1 }')
```
