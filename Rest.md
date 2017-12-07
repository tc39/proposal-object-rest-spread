Object Rest Destructuring
-------------------------

[Specification](Spec.md#rest-properties)

### Examples ###

__Shallow Clone (excluding prototype)__
```javascript
let { ...aClone } = a;
```

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
  y: [y0, ...y12]
} = complex;

xa; // 1
xbc; // { b: 2, c: 3 }
y0; // 4
y12; // [5, 6]
```

__Extending a Function with Additional Options__
```javascript
function baseFunction({ a, b }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
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
function wrapperFunction({ x, y, ...restConfig }) {
  // x won't be accidentally passed to baseFunction after this refactor
  return baseFunction(restConfig);
}
```

If the wrapper function wants to consume the x property but also pass it along, it can remerge it in using the spread operator.

```javascript
function baseFunction({ a, b, x }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
  // explicitly pass x along
  return baseFunction({ ...restConfig, x });
}
```

__Caveat: Only Own Properties__
```javascript
function ownX({ ...properties }) {
  return properties.x;
}
ownX(Object.create({ x: 1 })); // undefined
```

```javascript
let { x, y, ...z } = a;
// is not equivalent to
let { x, ...n } = a;
let { y, ...z } = n;
// because x and y use the prototype chain
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

### Prior Art ###

__Successor-ML__
```ml
val { x = x, y = y, ... = z } = obj
```
http://successor-ml.org/index.php?title=Functional_record_extension_and_row_capture

Mentioned on the destructuring assignment wiki in previous discussions:

http://wiki.ecmascript.org/doku.php?id=discussion:destructuring_assignment#successor-ml_and_row_capture

http://wiki.ecmascript.org/doku.php?id=harmony:destructuring#issues
