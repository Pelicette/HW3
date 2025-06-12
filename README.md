## 6-1-1

어떤 생성자 함수를 new 연산자와 함께 호출하면 

constructor에서 정의된 내용을 바탕으로 새로운 인스턴스가 생성된다.

이때 인스턴스에슷 __proto__라는 프로퍼티가 자도응로 부여되는데 

이 프로퍼티는 constructor의 prototype이라를 프로퍼티를 참조한다.

prototype객체 내부에는 인스턴스가 사용할 메서드를 저장한다. 따라서 인스턴스에서 __proto__를 통해 메서드에 접근 가능하다. 

```
var Person = function(name) {
  this._name = name;
};
Person.prototype.getName = function() {
  return this._name;
};

var suzi = new Person('Suzi');
console.log(suzi.__proto__.getName());
```

메서드로 getName을 정의하고 생성된 객체 suzi에서 __proto__.getName()로 메서드를 접근하였다. 그런데 이때 undefined가 나온다.

그 이유는 getName메서드 호출시 this가 suzi.__proto__이고 그 안에 _name이 정의되었지 않기 때문이다. 


```
suzi.__proto__._name='suzi__proto__'
```

처럼 프로퍼티를 만들어 주면 정상 출력한다. 


## 6-1-2

앞의 예제처럼 말고 __proto__없이 인스턴스에서 바로 메서드를 써도 this의 바인딩 문제가 해결된다. 

```
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
```

suzi.getName()수행시 getName의 this는 suzi가 되므로 정상 출력한다. 

그런데 __proto__를 사용하지않고 메서드에 접근하는것은 이상하다.

그 이유는 proto가 생략가능하기 때문이다. 있다면 this가 suzi.__proto__를 가리키고 없다면 suzi를 가리키는 것이다. 

생략해도 메서드에 접근은 가능하다. 


## 6-2

prototype과 proto의 관계를 알아보는 예제이다.  

```
var Constructor = function(name) {
  this.name = name;
};
Constructor.prototype.method1 = function() {};
Constructor.prototype.property1 = 'Constructor Prototype Property';

var instance = new Constructor('Instance');
console.dir(Constructor);
console.dir(instance);

var arr = [1, 2];
console.dir(arr);
console.dir(Array);
```

console.dir(Constructor)에서 구조를 보면 함수정보인 이름 길이등이 안오고 안의 prototype에서 작성자가 정의한 method1, property1메서드들이 나와았다. 

console.dir(instance)로 생성자로 생성된 객체의 구조를 보자 출력에는 constructor로 나오는데 해당 생성자 함수의 인스턴스임을 나타낸다. 

그리고 __proto__에서 생성자 함수의 메서드인 method1, property1가 등장한다. 

console.dir(arr)로 변수를 출력하면 역시 __proto__로 배열의 메서드들을 확인할수있다. 

console.dir(Array)를 보면 prototype에서 메서드들으리 정보를 볼수있다. 

이 예제로 prototype과 __proto__의 관계를 명확히 알수있다. 평소에 사용한 [].메서드 는 __proto__가 생략되고 this는 []를 가리키면서 prototype안의 메서드를 

사용가능하다. 



## 6-3

constructor라는 프로퍼티가 있는데 이것은 prototype객체와 __proto__안에 모두 있다. 이것은 원래의 생성자 함수를 가리키게하여 인스턴스의

원형이 무었인지 알수있게한다.

```
var arr = [1, 2];
Array.prototype.constructor === Array;
arr.__proto__.constructor === Array; 
arr.constructor === Array; 

var arr2 = new arr.constructor(3, 4);
console.log(arr2); 
```

Array.prototype.constructor는 생성자 자기자신을 가리키므로 true

arr.__proto__.constructor proto의 constructor는 인스턴스 원형인 Array를 가리키므로 true

arr.constructor는 __proto__가 생략가능하므로 위와같이 true


## 6-4

constructor는 읽기 속성이 부여된 경우 number ,string, boolean을 제외하고 값을 바꿀수 있다. 

```
var NewConstructor = function() {
  console.log('this is new constuctor!');
};
var dataTypes = [
  1, 
  'test', 
  true, 
  {}, 
  [], 
  function() {}, 
  /test/, 
  new Number(), 
  new String(), 
  new Boolean(), 
  new Object(), 
  new Array(), 
  new Function(),
  new RegExp(), 
  new Date(),
  new Error(),
];

dataTypes.forEach(function(d) {
  d.constructor = NewConstructor;
  console.log(d.constructor.name, '&', d instanceof NewConstructor);
});
```

모든 결과에 대해 false를 반환함으로 constructor를 바꾸어도 가리키는 대상이 바뀌는것이지 인스턴스의 원형이 바뀌는것이 아니다.

따라서 인스턴스의 생성자정보를 알기위해 constuctor를 사용한다면 정확하지 않을수있다. 