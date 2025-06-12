Object.prototype.getEntries = function() {
  var res = [];
  for (var prop in this) {
    if (this.hasOwnProperty(prop)) {
      res.push([prop, this[prop]]);
    }
  }
  return res;
};
var data = [
  ['object', { a: 1, b: 2, c: 3 }], 
  ['number', 345],
  ['string', 'abc'], 
  ['boolean', false], 
  ['func', function() {}], 
  ['array', [1, 2, 3]],
];
data.forEach(function(datum) {
  console.log(datum[1].getEntries());
});