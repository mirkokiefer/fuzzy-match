#fuzzy-match
Match edited strings (or other values) by similarity.

The goal is to be able to do 3-way merges considering sentence/word movements in text.  
After having matched the strings the output can be used to do these merges with [difftools](https://github.com/mirkok/difftools).  

``` js
var before = [
  'Hello world',
  'Node.js is really awesome',
  'fuzzy-id allows you to match arrays by similarity',
  'And finally a last sentence'
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
var split = function(value) {
  return value.split(' ')
}

var result = match(origin, modified, {split: split})
// returns:
[
  {before: 0, value: 'Hello world'},
  {before: 2, value: 'fuzzy-id allows you to match arrays by similarity - how great!'},
  {before: 1, value: 'Node.js is awesome'},
  {before: undefined, value: 'This one should not match'},
  {before: 3, value: 'And finally a last sentence'}
]
```
