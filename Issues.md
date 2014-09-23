Known Issues
------------

### Own Properties

This only copies own properties just like Object.assign. You could imagine all enumerable properties on the prototype chain being copied. I believe the same arguments for Object.assign not doing that applies here as well. Namely that Object.prototype can be tainted and therefore would jeopardize the integrity of
the code using this syntax.

Only own properties are listed in the rest object. This means that explicitly listing out properties have different semantics.

```javascript
let { x, ...z } = n, y = z.y;
```
is not equivalent to:
```javascript
let { x, y, ...z } = n;
```

This might be confusing but the mental model is that `...` is not a convenience for copying the entire object, instead it's a convenience for expanding all enumerable own keys.

#### Security Consideration

Syntax introduces a new way to determine ownness without going through (patchable) library functions:

Object.prototype.hasOwnProperty
Object.keys
etc.

There are no known issues that this would expose. The only case where this would be an issue is if you want to introduce hidden properties. However, non-enumerable properties already provide this ability.

### Duplicate Keys and Order Dependency

This pattern necessitates that duplicate keys are allowed because this enables the functional style updating of records.

```javascript
let oldRecord = { x: 1, y: 2 };
let newRecord = { ...oldRecord, y: 3 };
newRecord; // { x: 1, y: 3 }
```

This also means that property order in the object literal is order dependent.

```javascript
let oldRecord = { x: 1, y: 2 };
let newRecord = { y: 3, ...oldRecord };
newRecord; // { x: 1, y: 2 }
```

### Getters

Getters are executed on any source rather than copying the descriptors over to the new object. This seems natural and is consistent with Object.assign.

### Setters

Properties on object literals are defined as new value on the object. It does not invoke any newly defined setters. This is different than what Object.assign on a recently defined object does.

```javascript
let record = { x: 1 };
let obj = { set x() { throw new Error(); }, ...record }; // not error
obj.x; // 1
```

### Linters Complain About Unused Variables

If you use destructuring merely to pick properties off an object, then you will end up with an unused variable.

```javascript
var { x, y, ...rest } = obj; // lint will complain. y is unused.
foo(x, rest);
```

This is a consideration for linters and known from plenty of other languages. One possible solution is to use underscore to annotate an unused variable.

```javascript
var { x, y: _, ...rest } = obj;
foo(x, rest);
```
