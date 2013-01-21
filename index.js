
var _ = require('underscore')
var arrayDiff = require('array-diff')()

var groupAndSplit = function(diff, split) {
  var deleted = []
  var added = []
  var equal = []
  var indexBefore = 0, indexAfter = 0
  diff.forEach(function(each) {
    switch (each[0]) {
      case '=':
        equal.push({before: indexBefore, value: each[1], pos: indexAfter})
        indexBefore++; indexAfter++
        break
      case '-':
        deleted.push({before: indexBefore, value: split(each[1])})
        indexBefore++
        break
      case '+':
        added.push({value: split(each[1]), pos: indexAfter})
        indexAfter++
    }
  })
  return {equal: equal, deleted: deleted, added: added}
}

var matchModifiedValues = function(deleted, added, minRatio) {
  var matches = []
  added.forEach(function(entryAfter) {
    var takeBestEqualRatio = function(bestCandidate, entryBefore) {
      var diff = arrayDiff(entryBefore.value, entryAfter.value)
      var sumEquals = function(previous, each) { return each[0] == '=' ? previous+1 : previous }
      var equalRatio = diff.reduce(sumEquals, 0) / diff.length
      return equalRatio > bestCandidate.ratio ? {ratio: equalRatio, entry: entryBefore} : bestCandidate
    }
    var bestCandidate = deleted.reduce(takeBestEqualRatio, {ratio: minRatio, entry:{}})
    entryAfter.before = bestCandidate.entry.before
    matches.push(entryAfter)
  })
  return matches
}

var match = function(before, after, options) {
  options = options || {}
  var minRatio = options.minRatio || 0.5
  var diff = arrayDiff(before, after)
  var grouped = groupAndSplit(diff, options.split)
  var fuzzyMatches = matchModifiedValues(grouped.deleted, grouped.added, minRatio)
    .map(function(each) { return {value:after[each.pos], before: each.before, pos: each.pos }})
  return grouped.equal.concat(fuzzyMatches)
    .sort(function(a, b) { return a.pos > b.pos })
    .map(function(each) { return {before: each.before, value: each.value} })
}

module.exports = match
