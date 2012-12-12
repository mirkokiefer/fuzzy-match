#fuzzy-id
Match edited strings (or other values) by similarity.

The goal is to be able to do 3-way merges considering sentence/word movements in text.  
After having matched the strings the output can be used to do these merges with [id-diff](https://github.com/mirkok/id-diff) and [id-merge](https://github.com/mirkok/id-merge).  

``` js
var before = [
  {id: 1, value: 'Hello world'},
  {id: 2, value: 'Node.js is really awesome'},
  {id: 3, value: 'fuzzy-id allows you to match arrays by similarity'},
  {id: 4, value: 'And finally a last sentence'}
]

// we lost all IDs and strings were moved around:
var after = [
  'Hello world',
  'fuzzy-id allows you to match arrays by similarity - how great!',
  'Node.js is awesome',
  'This one should not match',
  'And finally a last sentence',
]

// required function to decompose values into arrays for comparison:
var decompose = function(value) {
  return value.split(' ')
}

var result = match(origin, modified, {decompose: decompose})
// returns:
[
  {id: 1, value: 'Hello world'},
  {id: 3, value: 'fuzzy-id allows you to match arrays by similarity - how great!'},
  {id: 2, value: 'Node.js is awesome'},
  {id: undefined, value: 'This one should not match'},
  {id: 4, value: 'And finally a last sentence'}
]
``