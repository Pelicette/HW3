var arr = [1, 2];
Array.prototype.toString.call(arr);
Object.prototype.toString.call(arr);
arr.toString();

arr.toString = function() {
  return this.join('_');
};
arr.toString();