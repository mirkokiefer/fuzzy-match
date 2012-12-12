
var _ = require('underscore')
var arrayDiff = require('array-diff')()

var groupAndDecompose = function(diff, before, decompose) {
  var deleted = []
  var added = []
  var equal = []
  var indexBefore = 0, indexAfter = 0
  diff.forEach(function(each) {
    switch (each[0]) {
      case '=':
        equal.push({id: before[indexBefore].id, value: each[1], pos: indexAfter})
        indexBefore++; indexAfter++
        break
      case '-':
        deleted.push({id: before[indexBefore].id, value: decompose(each[1])})
        indexBefore++
        break
      case '+':
        added.push({value: decompose(each[1]), pos: indexAfter})
        indexAfter++
    }
  })
  return {equal: equal, deleted: deleted, added: added}
}

var matchModifiedValues = function(deleted, added) {
  var matches = []
  deleted.forEach(function(entryBefore) {
    var takeBestEqualRatio = function(bestCandidate, newCandidate) {
      var diff = arrayDiff(entryBefore.value, newCandidate.value)
      var sumEquals = function(previous, each) { return each[0] == '=' ? previous+1 : previous }
      var equalRatio = diff.reduce(sumEquals, 0) / diff.length
      return equalRatio > bestCandidate.ratio ? {ratio: equalRatio, entry: newCandidate} : bestCandidate
    }
    var bestCandidate = added.reduce(takeBestEqualRatio, {ratio: 0})
    bestCandidate.entry.id = entryBefore.id
    matches.push(bestCandidate.entry)
  })
  return matches
}

var match = function(before, after, options) {
  options = options || {}
  var beforeValues = _.pluck(before, 'value')
  var diff = arrayDiff(beforeValues, after)
  var grouped = groupAndDecompose(diff, before, options.decompose)
  var fuzzyMatches = matchModifiedValues(grouped.deleted, grouped.added)
    .map(function(each) { return {value:after[each.pos], id: each.id, pos: each.pos }})
  return grouped.equal.concat(fuzzyMatches)
    .sort(function(a, b) { return a.pos > b.pos })
    .map(function(each) { return {id: each.id, value: each.value} })
}

module.exports = match