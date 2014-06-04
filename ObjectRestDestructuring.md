Object Rest Destructuring
-------------------------

### Examples ###

__Single Level__
```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

__Extending a Base Function with Additional Properties__
```javascript
function baseFunction({ a, b }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // do something with x and y
  return baseFunction(restConfig);
}
```

Extra properties may be added to `baseFunction`. The `higherFunction` won't accidentally pass the `x` property along since it's stripped out.

```javascript
function baseFunction({ a, b, x }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // do something with x and y, then pass the rest to the base function
  return baseFunction(restConfig);
}
```

If the higher order function wants to consume the x property but also pass it along, it can remerge it in using the spread operator.

```javascript
function baseFunction({ a, b, x }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // do something with x and y
  return baseFunction({ ...restConfig, x });
}
```

__Restructure using Object Spread Operator__
```javascript
// Destructuring
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
// Restructuring
let reassembled = { x, y, ...z };
```

__Runtime Error__
```javascript
let { x, y, ...z } = null; // runtime error
```

__Static Error__
```javascript
let { ...x, y, z } = obj; // syntax error
```
```javascript
let { x, ...y, ...z } = obj; // syntax error
```

### Syntax ###

ObjectAssignmentPattern:
- `{` AssignmentRestProperty `}`
- `{` AssignmentPropertyList `,` AssignmentRestProperty `}`
- etc.

AssignmentRestProperty:
- `...` DestructuringAssignmentTarget

ObjectBindingPattern:
- `{` BindingRestProperty `}`
- `{` BindingPropertyList `,` BindingRestProperty `}`
- etc.

BindingRestProperty:
- `...` BindingIdentifier

### Runtime Semantics ###

The runtime semantics of `...` _DestructuringAssignmentTarget_ in an object destructuring's _AssignmentProperty_ would be collecting all the remaining properties into a new object.
