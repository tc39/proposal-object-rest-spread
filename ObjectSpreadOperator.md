### Syntax ###

PropertyDefinitionList:
- PropertyDefinition
- PropertyDefinitionList `,` PropertyDefinition

PropertyDefinition:
- `...` AssignmentExpression
- etc.


### Runtime Semantics: PropertyDefinitionEvaluation ###

With parameter `object`.

_PropertyDefinition : `...` AssignmentExpression_

NOTE: This follows the same semantics as Object.assign(`object`, _AssignmentExpression_).

1. Let `exprValue` be the result of evaluating _AssignmentExpression_.
2. Let `propValue` be GetValue(`exprValue`).
3. ReturnIfAbrupt(propValue).
4. Let `from` be ToObject(`propValue`).
5. ReturnIfAbrupt(`from`).
6. Let `keysArray` be the result of calling the [[OwnPropertyKeys]] internal method of `propValue`.
7. ReturnIfAbrupt(`keysArray`).
8. Let `lenValue` be Get(`keysArray`, __"length"__).
9. Let `len` be ToLength(`lenValue`).
10. ReturnIfAbrupt(`len`).
11. Let `nextIndex` be 0.
12. Let `pendingException` be __undefined__.
13. Repeat while `nextIndex` < `len`,
  1. Let `nextKey` be Get(`keysArray`, ToString(`nextIndex`)).
  2. ReturnIfAbrupt(`nextKey`).
  3. Let desc be the result of calling the [[GetOwnProperty]] internal method of from with argument `nextKey`.
  4. If `desc` is an abrupt completion, then
    1. If `pendingException` is __undefined__, then set `pendingException` to `desc`.
  5. Else if `desc` is not __undefined__ and `desc`.[[Enumerable]] is __true__, then
    1. Let `propValue` be Get(`from`, `nextKey`).
    2. If `propValue` is an abrupt completion, then
      1. If `pendingException` is __undefined__, then set `pendingException` to `propValue`.
    3. else
      1. Let `status` be Put(`object`, `nextKey`, `propValue`, __true__);
      2. If `status` is an abrupt completion, then
        1. If `pendingException` is __undefined__, then set `pendingException` to `status`.
  6. Increment `nextIndex` by 1.
14. If `pendingException` is not __undefined__, then return `pendingException`.
15. return `true`


### Examples ###

__Shallow Clone__
```javascript
let aClone = { ...a };
```
_Desugars into:_
```javascript
let aClone = Object.assign({}, a);
```

__Merging Two Objects__
```javascript
let ab = { ...a, ...b };
```
_Desugars into:_
```javascript
let ab = Object.assign({}, a, b);
```

__Overiding Properties__
```javascript
let aWithOverrides = { ...a, x: 1, y: 2 };
// equivalent to
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } };
```
_Desugars into:_
```javascript
let aWithOverrides = Object.assign({}, a, { x: 1, y: 2 });
```

__Default Properties__
```javascript
let aWithDefaults = { x: 1, y: 2, ...a };
```
_Desugars into:_
```javascript
let aWithDefaults = Object.assign({}, { x: 1, y: 2 }, a);
// which can be optimized without the empty object
let aWithDefaults = Object.assign({ x: 1, y: 2 }, a);
```

__Multiple Merges__
```javascript
// getters on a are executed twice
let xyWithAandB = { x: 1, ...a, y: 2, ...b, ...a };
```
_Desugars into:_
```javascript
let xyWithAandB = Object.assign({ x: 1 }, a, { y: 2 }, b, a);
```

__Getters on the Object Initializer__
```javascript
// Does not throw because .x isn't evaluated yet. It's defined.
let aWithXGetter = { ...a, get x() { throws new Error('not thrown yet') } }; 
```
_Desugars into:_
```javascript
let aWithXGetter = {};
Object.assign(aWithXGetter, a);
Object.defineProperty(aWithXGetter, "x", {
  get(){ throws new Error('not thrown yet') },
  enumerable : true,
  configurable : true
});
```

__Getters in the Spread Object__
```javascript
// Throws because the .x property of the inner object is evaluated when the
// property value is copied over to the surrounding object initializer.
let runtimeError = { ...a, ...{ get x() { throws new Error('thrown now') } } };
```

__Static Error__
```javascript
let doubleX = { x: 1, ...a, x: 2 }; // static error in strict mode
```

__Runtime Error__
```javascript
let nonObject = { ...null }; // throws TypeError exception
```

__Updating Deep Immutable Object__
```javascript
let newVersion = {
  ...previousVersion,
  name: 'New Name', // Override the name property
  items: [...parent.items, { title: 'New Item' }] // Add an item to the list of items
};
```
Note: This pattern could get additional sugar in the future by making the `parent.items` identifier optional.

### Destructuring Parallel ###

This proposal could be expanded with a parallel destructuring proposal. The runtime semantics of `...` _DestructuringAssignmentTarget_ in an object destructuring's _AssignmentProperty_ would be collecting all the remaining properties into a new object.

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }

let n = { x, y, ...z };
n; // { x: 1, y: 2, a: 3, b: 4 }
```

