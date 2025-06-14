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



## 6-5

아래와 같은 방법으로 constructor에 접근할수있다. 

```
var Person = function(name) {
  this.name = name;
};
var p1 = new Person('사람1');
var p1Proto = Object.getPrototypeOf(p1);
var p2 = new Person.prototype.constructor('사람2'); 
var p3 = new p1Proto.constructor('사람3'); 
var p4 = new p1.__proto__.constructor('사람4');
var p5 = new p1.constructor('사람5');

[p1, p2, p3, p4, p5].forEach(function(p) {
  console.log(p, p instanceof Person);
});
```

var p2 = new Person.prototype.constructor 생성자 함수의 property의 constructor는 생성자 를 가리킨다. 

var p1Proto = Object.getPrototypeOf(p1);

var p3 = new p1Proto.constructor('사람3') 

p1의 prototype은 Person.prototype와 같으므로 같은 출력이다. 

var p4 = new p1.__proto__.constructor('사람4') __proto__는 생성자 함수의 prototype을 참조하므로 앞의 출력과 같다.

var p5 = new p1.constructor('사람5') 에서 __proto__는 생략 가능하므로 앞의 출력과 같다. 



## 6-6

원본 함수의 메서드와 동일한 이름의 메서드를 인스턴스가 가지고 있을때 어떻게 되는가??

자바 스크립트에서 메서드를 찾는 방법은 가장 가까운 자신의 프로퍼티에서 찾고 없으면 __proto__로 생성자 함수의 메서드를 찾는것이다.

이때 주의할것이 원본의 메서드가 없어진것이 아니라 그냥 덮어씌어진것이므로 원본 메서드는 남아있다. 


```
var Person = function(name) {
  this.name = name;
};
Person.prototype.getName = function() {
  return this.name;
};

var iu = new Person('지금');
iu.getName = function() {
  return '바로 ' + this.name;
};
console.log(iu.getName());
```

Person이 getName 메서드를 가지고 있고 이후 iu.getName = function()로 중복된 이름의 메서드를 만들고 수행했다

앞에서 설명한 것과 같이 가장가까운 자신의 프로퍼티를 검색하여 iu.getName을 수행한다. 출력은 바로 지금이 나온다. 




## 6-7

프로토타입 체인에 대한 예제이다. 

모든 객체의 __proto__에는 Object.prototype이 연결된다.

어떤 메서드를 호출하면 자신의 프로퍼티에 없으면 계속 __proto__를 타고 올라가서 찾는다. 

이것을 프로토아비 체이닝 이라고한다.

```
var arr = [1, 2];
arr.push(3);
arr.hasOwnProperty(2); 
```

arr.push(3) 은 arr.__proto__.push(3)로 생략된 __proto__로 Arry의 메서드를 사용할수있다. 

arr.hasOwnProperty(2)은 arr.__proto__.__proto__.hasOwnProperty(2)로 arr.__proto__는 Array의 prototype이고 여기서 추가로 .__proto__는

Object.prototype을 가리킨다 즉 __proto__을 2번생략하여 Object의 메서드를 사용할수있다. 



## 6-8

메서드 오버라이드와 프로토타입 체이닝을 기반으로 어떤메서드가 수행되는지 알아보자 

```
var arr = [1, 2];
Array.prototype.toString.call(arr);
Object.prototype.toString.call(arr);
arr.toString();

arr.toString = function() {
  return this.join('_');
};
arr.toString();
```

arr.toString() 수행시 프로토타입 체이닝을 때라 가장 가까운 Array.prototype.toString을 적용한다.

이후 arr.toString = function()으로 arr객체에 매서드를 정의하고 다시 arr.toString()수행시 가장 가까운 자신의 arr.toString = function()를 수행한다.



## 6-9 

Object.prototype이 언제나 프로토타입 체인의 최상단에 존재하게된다. 

객체에서만 사용할 메서드를 Object.prototype에 정의하면 데이터 타입이 달라도 프로토타입 체이닝으로 메서드에 접근해버린다.

```
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
```

Object.prototype.getEntries = function()로 객체에서만 사용할 함수를 만들었는데 

```
data.forEach(function(datum) {
  console.log(datum[1].getEntries());
});
```

에서 모든 데이터 타입에 대해서 프로토타입 체이닝을따라 메서드를 찾아내 정상동작해버린다.

따라서 객체를 대상으로 동작하게 만들고 싶을때는 static method로 부여해야한다.



## 6-10

프로토타입 체인은 2단계뿐만아니라 이론상 무한대로 가능하다. 

그 방법은 __proto__가 생성자 함수의 prototype이 연결하고자 하는 상위 생성자 함수의 인스턴스를 바라보게 하면 된다. 

```
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};
var g = new Grade(100, 80);
```

var Grade = function()으로 유사배열 객체를 만들었는데 이것을 Array와 프로토타입 체이닝을 통해 Array의 메서드를 사용하고 싶다.

```
Grade.prototype=[];
```

을 추가하면 Grade.prototype이 배열을 가리키고 이 배열의 __proto__는 Array prototype이므로 Grade-Array-Object순으로 3단계의 

프로토타입 체인이 완성되어 g에서 Array 메서드를 사용할수있다. 


## 7-1 

자바스크립트에서는 클래스의 개념이 존재하지 않는다. 하지만 앞에서배운 프로토타입 체이닝을 사용하면 클래스와 같이 이해할수있다.

인스턴스에 상속되는 메서드는 생성자 함수의 prototype에 정의되어있고 스태틱 맴버라고 하고 인스턴스 자체에서 만든 메서드는 프로토타입 메서드라고 한다.

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
Rectangle.isRectangle = function(instance) {
  return (
    instance instanceof Rectangle && instance.width > 0 && instance.height > 0
  );
};

var rect1 = new Rectangle(3, 4);
console.log(rect1.getArea()); 
console.log(rect1.isRectangle(rect1)); 
console.log(Rectangle.isRectangle(rect1)); 
```

console.log(rect1.getArea()) 에서 __proto__가 생략되어 생성자 함수의 메서드인 getArea를 실행하여 12를 출력한다. 

console.log(rect1.isRectangle(rect1)) 에서 프로토타입 체이닝을 따라 isRectangle을 찾을수 없어 오류를 출력한다. 



## 7-2

이제부터 예제 6-2-4의 코드를 기반으로 클래스에 대해 알아본다. 

```
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};
Grade.prototype = [];
var g = new Grade(100, 80);
```

자바스크립트에서 클래스 상속은 프로토타입 체이닝을 연결했다는 것인데 문제가 발생한다.

Grade.prototype = []처럼 빈 배열을 참조시킨것과 lengh프로퍼티가 삭제 가능하다는 점이다.



## 7-3 

이전 예제에서 말한대로 lenght프로퍼티를 건드릴수 있음을 확인하는 예제이다. 

```
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};
Grade.prototype = [];
var g = new Grade(100, 80);

g.push(90);
console.log(g);

delete g.length;
g.push(70);
console.log(g);
```

원래 length가 3이였는데 delete g.length로 length를 삭제한후 70을 push해서 length가 1이된다. 

그 이유는 배열 인스턴스의 length는 삭제 불가능 이지만 사용자가 만든 유사배열객체인 Grade는 배열이 아니므로 length를 삭제가능하기때문이다.

배열 0에 70이 들어가는 이유는 g의 length를 삭제했기 때문에 체이닝을 따라 빈배열을 찾게되어 length가 0이므로 인덱스 0에 값을 할당한것이다. 


## 7-4

이번에는 Grade.prototype에 빈 배열이 아니라 요소가 있는경우에 어떻게 되는지 보자.

```
var Grade = function() {
  var args = Array.prototype.slice.call(arguments);
  for (var i = 0; i < args.length; i++) {
    this[i] = args[i];
  }
  this.length = args.length;
};
Grade.prototype = ['a', 'b', 'c', 'd'];
var g = new Grade(100, 80);

g.push(90);
console.log(g);

delete g.length;
g.push(70);
console.log(g);
```

Grade.prototype = ['a', 'b', 'c', 'd']로 빈 배열이 아닌 lenght가 4인 배열을 할당하여 진항해보자. 

처음 90을 push한 것 까지는 정상적인 동작이지만 length를 삭제한 이후 70을 push하면 

length가 삭제되어 프로토타입 체이닝을 따라 ['a', 'b', 'c', 'd']의 length가 4임을 찾고 5에 push한다. 

결과적으로 클래스틔 값이 인스턴스의 동작에 영향을 주게 된다. 이는 원하는 동작이 아니다. 



## 7-5 

상위 하위 클래스를 만드는 예제이다. 

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var rect = new Rectangle(3, 4);
console.log(rect.getArea()); 

var Square = function(width) {
  this.width = width;
};
Square.prototype.getArea = function() {
  return this.width * this.width;
};
var sq = new Square(5);
console.log(sq.getArea());
```
Rectangle은 width와 height을 가지고 getArea는 이 둘을 곱하는 것이고 

Square는 width만을 가지고 getArea는 width를 제곱하는 것이다. 

이때 Sqaure에서 height를 사용하면서 width값을 부여한다면 getArea를 동일하게 만들수있다. 


## 7-6

위의 예제의 설명에서와 같이 소스에서 Square의 getArea또한 Rectangle과 같게 코드를 구성하였고 

이제 소스상에서 Square가 Rectangle의 하위 클래스로 볼수있다. 

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var rect = new Rectangle(3, 4);
console.log(rect.getArea());

var Square = function(width) {
  this.width = width;
  this.height = width;
};
Square.prototype.getArea = function() {
  return this.width * this.height;
};

var sq = new Square(5);
console.log(sq.getArea()); 
```



## 7-7

메서드를 상속하기위해 앞의 예제보다 간단하게 구현할수있다. 

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var rect = new Rectangle(3, 4);
console.log(rect.getArea()); 

var Square = function(width) {
  Rectangle.call(this, width, width);
};
Square.prototype = new Rectangle();

var sq = new Square(5);
console.log(sq.getArea()); 
```


```
var Square = function(width) {
  Rectangle.call(this, width, width);
};
```
로 Square에 width를 넣을시 Rectangle의 width와 height에 모두 width를 넣고 

Square.prototype = new Rectangle()으로 프로토타입 체이닝을 통해 메서드에 접근하게 한다면 

원하는대로 하위 클래스가 만들어진다. 

하지만 Square의 width에 임의의 값을 할당하고 생성된 객체 sq의 width를 지운다면 프로토타입 체이닝으로 width는 임의의 값을 가지게 될것이다.




## 7-8

위의 예제와 같은 문제를 가지지 않게하기위해 

클래스가 구체적인 데이터를 지니지 않게 하기위해 프로퍼티들을 지우고 새로운 프로퍼티를 추가 할 수없게하는 방법이있다. 

```
var extendClass1 = function(SuperClass, SubClass, subMethods) {
  SubClass.prototype = new SuperClass();
  for (var prop in SubClass.prototype) {
    if (SubClass.prototype.hasOwnProperty(prop)) {
      delete SubClass.prototype[prop];
    }
  }
  if (subMethods) {
    for (var method in subMethods) {
      SubClass.prototype[method] = subMethods[method];
    }
  }
  Object.freeze(SubClass.prototype);
  return SubClass;
};
```

Subclass의 prototype에 SuperClass를 할당하여 메서드를 상속하고 

반복문으로 subclass에 프로티가 있다면 삭제시키고 사용자가 설정한 subMethod를 넣어준후 freeze해준다. 

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var Square = extendClass1(Rectangle, function(width) {
  Rectangle.call(this, width, width);
});
var sq = new Square(5);
console.log(sq.getArea()); 
```

위와 같은 방식으로 Rectanel의 하위 클래스 Square를 프로퍼티를 제거하고 superclass Rectangle의 argument에 모두 width정보를 넣어 메서드를 상속한다. 

결과적으로 Square가 Rectangledml getArea를 사용할수있다. 



## 7-9 

또다른 방법으로 빈생성자 함수(Bridge)를 만들어서 빈생성자 함수의 prototype이 superclass의 prototype을 바라보게하고 subclass의 prototype에는 

Bridge의 인스턴스를 할당하는 방법이 있다. 이렇게 하면 프로토타입 경로상에 데이터가 남아있지 않게된다. 

```
var extendClass2 = (function() {
  var Bridge = function() {};
  return function(SuperClass, SubClass, subMethods) {
    Bridge.prototype = SuperClass.prototype;
    SubClass.prototype = new Bridge();
    if (subMethods) {
      for (var method in subMethods) {
        SubClass.prototype[method] = subMethods[method];
      }
    }
    Object.freeze(SubClass.prototype);
    return SubClass;
  };
})();

var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var Square = extendClass2(Rectangle, function(width) {
  Rectangle.call(this, width, width);
});
var sq = new Square(5);
console.log(sq.getArea());
```

결과는  extendClass2로 square를 Rectangle의 서브 클래스로 할당하여 Rectangle의 getArea를 사용할수 있게 되었고 

var sq = new Square(5)로 width=5 getArea의 출력은 25이다. 



## 7-10

또다른 방법으로 Object.create를 사용하는 방법이 있다. 

```
var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var Square = function(width) {
  Rectangle.call(this, width, width);
};
Square.prototype = Object.create(Rectangle.prototype);
Object.freeze(Square.prototype);

var sq = new Square(5);
console.log(sq.getArea());
```

이 방법으로 subclass의 prototype의 __proto__가 superclass의 prototype을 바라보지만 superclass의 인스턴스가 되지는 않는다. 

결과적으로 프로토타입 체이닝을 통해 메서드를 상속하여서 getArea를 사용하여 25를 출력한다.s



## 7-11 

앞의 예제에서 클래스 상속의 3가지 방법을 실습하였다. 하지만 subclass에서 constructor는 superclass이다. 

subclass에는 constructor가 없고 프로토타입 체이닝으로 superclass의 constructor 자기자신인 superclass가 나오는 것이다.

이제 subclass의 constructor가 subclass를 가리키게 해야한다. 

```
var extendClass1 = function(SuperClass, SubClass, subMethods) {
  SubClass.prototype = new SuperClass();
  for (var prop in SubClass.prototype) {
    if (SubClass.prototype.hasOwnProperty(prop)) {
      delete SubClass.prototype[prop];
    }
  }
  SubClass.prototype.consturctor = SubClass;
  if (subMethods) {
    for (var method in subMethods) {
      SubClass.prototype[method] = subMethods[method];
    }
  }
  Object.freeze(SubClass.prototype);
  return SubClass;
};
```

 SubClass.prototype.consturctor = SubClass;를 추가하여 완성한 코드이다. 



 ## 7-12

빈 함수를 활용한 방법에서 subclass의 constructor가 subclass를 가리키게 하는 코드를 추가하여 완성한 extendclass이다. 

 ```
 var extendClass2 = (function() {
  var Bridge = function() {};
  return function(SuperClass, SubClass, subMethods) {
    Bridge.prototype = SuperClass.prototype;
    SubClass.prototype = new Bridge();
    SubClass.prototype.consturctor = SubClass;
    Bridge.prototype.constructor = SuperClass;
    if (subMethods) {
      for (var method in subMethods) {
        SubClass.prototype[method] = subMethods[method];
      }
    }
    Object.freeze(SubClass.prototype);
    return SubClass;
  };
})();
```

SubClass.prototype.consturctor = SubClass코드를 통하여 코드를 완성하였다. 



## 7-13

Object.create를 사용한 상속방법에서 subclass의 constructor가 subclass를 가리키게 하는 코드를 추가하여 완성한 extendclass이다. 

```
var extendClass3 = function(SuperClass, SubClass, subMethods) {
  SubClass.prototype = Object.create(SuperClass.prototype);
  SubClass.prototype.constructor = SubClass;
  if (subMethods) {
    for (var method in subMethods) {
      SubClass.prototype[method] = subMethods[method];
    }
  }
  Object.freeze(SubClass.prototype);
  return SubClass;
};
```

SubClass.prototype.consturctor = SubClass코드를 통하여 코드를 완성하였다. 



## 7-14

하위 클래스의 메서드에서 상위 클래스의 메서드의 결과를 사용하고 싶을때가 있을수 있다. 이를위해 super메서드를 사용한다.

```
var extendClass = function(SuperClass, SubClass, subMethods) {
  SubClass.prototype = Object.create(SuperClass.prototype);
  SubClass.prototype.constructor = SubClass;

```
  SubClass.prototype.super = function(propName) {
   
    var self = this;
    if (!propName)
      return function() {
        SuperClass.apply(self, arguments);
      };
    var prop = SuperClass.prototype[propName];
    if (typeof prop !== 'function') return prop;
    return function() {
      return prop.apply(self, arguments);
    };
  };
  ```

인자를 받지않으면 SuperClass.apply(self, arguments)로 생성자 함수에 접근한다. 

if (typeof prop !== 'function') 으로 함수가 아닌경우 그대로 반환,

위경우 모두 해당되지 않으면 prop.apply(self, arguments)으로 메서드에 접근한다. 

나머지 부분은 이전 예제와 동일하다.

  ```
  if (subMethods) {
    for (var method in subMethods) {
      SubClass.prototype[method] = subMethods[method];
    }
  }
  Object.freeze(SubClass.prototype);
  return SubClass;
};

var Rectangle = function(width, height) {
  this.width = width;
  this.height = height;
};
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};
var Square = extendClass(
  Rectangle,
  function(width) {
    this.super()(width, width); 
  },
  {
    getArea: function() {
      console.log('size is :', this.super('getArea')()); 
    },
  }
);
var sq = new Square(10);
sq.getArea(); 
console.log(sq.super('getArea')()); 
```

var Square = extendClass로 하위 클래에 다른 getArea함수를 정의한다. 

sq.getArea()은 size is : 100 dmfh subclass의 메서드가 실행되고

console.log(sq.super('getArea')())로 spuer로 getArea수행시 상위 클래스의 메서드에 접근하여 100을 출력한다. 