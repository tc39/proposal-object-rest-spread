Object Rest Destructuring
-------------------------

### Examples ###

__Rest Properties__
```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

__Nested Objects__
```javascript
let complex = {
  x: { a: 1, b: 2, c: 3 },
  y: [4, 5, 6]
};

let {
  x: { a: xa, ...xbc },
  y: [y0, ...y12] }
} = complex;

xa; // 1
xbc; // { b: 2, c: 3 }
y1; // 4
y12; // [5, 6]
```

__Extending a Function with Additional Options__
```javascript
function baseFunction({ a, b }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // do something with x and y
  // pass the rest to the base function
  return baseFunction(restConfig);
}
```

Extra properties may be safely added to `baseFunction`.

```javascript
function baseFunction({ a, b, x }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // x won't be accidentally passed to baseFunction after this refactor
  return baseFunction(restConfig);
}
```

If the higher order function wants to consume the x property but also pass it along, it can remerge it in using the spread operator.

```javascript
function baseFunction({ a, b, x }) {
  // ...
}
function higherFunction({ x, y, ...restConfig }) {
  // explicitly pass x along
  return baseFunction({ ...restConfig, x });
}
```

__Restructure using Object Spread Operator__
```javascript
let assembled = { x: 1, y: 2, a: 3, b: 4 };
let { x, y, ...z } = assembled;
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
```javascript
let { x: { ...z }, y: { ...z } } = obj; // static error
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

### Prior Art ###

```ml
  val { x = x, y = y, ... = z } = obj
```
http://successor-ml.org/index.php?title=Functional_record_extension_and_row_capture
(Mentioned on the destructuring assignment wiki http://wiki.ecmascript.org/doku.php?id=discussion:destructuring_assignment#successor-ml_and_row_capture )