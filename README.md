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