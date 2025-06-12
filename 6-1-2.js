var Person = function(name) {
  this._name = name;
};
Person.prototype.getName = function() {
  return this._name;
};

var suzi=new Person('Suzi',28);
console.log(suzi.getName());
var iu=new Person('Jieun',28);
console.log(iu.getName());