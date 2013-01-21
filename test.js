
var assert = require('assert')
var match = require('./index')

var before = [
  'Hello world',
  'Node.js is really awesome',
  'fuzzy-id allows you to match arrays by similarity',
  'And finally a last sentence'
]

var after = [
  'Hello world',
  'fuzzy-id allows you to match arrays by similarity - how great!',
  'Node.js is awesome',
  'This one should not match',
  'And finally a last sentence',
]

var expected = [
  {before: 0, value: 'Hello world'},
  {before: 2, value: 'fuzzy-id allows you to match arrays by similarity - how great!'},
  {before: 1, value: 'Node.js is awesome'},
  {before: undefined, value: 'This one should not match'},
  {before: 3, value: 'And finally a last sentence'}
]

var split = function(value) {
  return value.split(' ')
}

it('should identify all changed strings', function() {
  var result = match(before, after, {split: split})
  assert.deepEqual(result, expected)
})
