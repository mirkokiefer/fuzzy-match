
var assert = require('assert')
var match = require('./index')

var origin = [
  {id: 1, value: 'Hello world'},
  {id: 2, value: 'Node.js is really awesome'},
  {id: 3, value: 'fuzzy-id allows you to match arrays by similarity'},
  {id: 4, value: 'And finally a last sentence'}
]

var modified = [
  'Hello world',
  'fuzzy-id allows you to match arrays by similarity - how great!',
  'Node.js is awesome',
  'And finally a last sentence'
]

var expected = [
  {id: 1, value: 'Hello world'},
  {id: 3, value: 'fuzzy-id allows you to match arrays by similarity - how great!'},
  {id: 2, value: 'Node.js is awesome'},
  {id: 4, value: 'And finally a last sentence'}
]

var decompose = function(value) {
  return value.split(' ')
}

console.log(match(origin, modified, {decompose: decompose}))