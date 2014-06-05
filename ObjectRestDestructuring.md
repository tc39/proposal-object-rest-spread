Object Rest Destructuring
-------------------------

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
y1; // 4
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
```javascript
let { x: { ...z }, y: { ...z } } = obj; // static error
```

### Syntax ###

ObjectAssignmentPattern:
- `{` `...` IdentifierReference `}`
- `{` AssignmentPropertyList `,` `...` IdentifierReference `}`
- etc.

NOTE: This is explicitly disallowing nested object destructuring in the rest position. This is to avoid confusing syntax/semantics with regard to own vs. inherited properties.

ObjectBindingPattern:
- `{` `...` BindingIdentifier `}`
- `{` BindingPropertyList `,` `...` BindingIdentifier `}`
- etc.

### Static Semantics: AssignmentPropertyNames ###

_AssignmentPropertyList : AssignmentProperty_

1. Return AssignmentPropertyNames of _AssignmentProperty_.

_AssignmentPropertyList : AssignmentPropertyList , AssignmentProperty_

1. Let `names` be AssignmentPropertyNames of _AssignmentPropertyList_.
2. Append to `names` the elements of the AssignmentPropertyNames of _AssignmentProperty_.
3. Return `names`.

_AssignmentProperty : IdentifierReference Initializer<sub>opt</sub>_

1. Return a new __List__ containing _IdentifierReference_.

_AssignmentProperty : PropertyName `:` AssignmentElement_

1. Return a new __List__ containing _PropertyName_.

### Static Semantics: BindingPropertyNames ###

_BindingPropertyList : BindingProperty_

1. Return BindingPropertyNames of _BindingProperty_.

_BindingPropertyList : BindingPropertyList , BindingProperty_

1. Let `names` be BindingPropertyNames of _BindingPropertyList_.
2. Append to `names` the elements of the BindingPropertyNames of _BindingProperty_.
3. Return `names`.

_BindingProperty : PropertyName `:` BindingElement_

1. Return a new __List__ containing _PropertyName_.

_BindingProperty : SingleNameBinding_

1. Return BindingPropertyNames of _SingleNameBinding_.

_SingleNameBinding : BindingIdentifier Initializer<sub>opt</sub>_

1. Return a new __List__ containing _BindingIdentifier_.

### Runtime Semantics ###

The runtime semantics of `...` _IdentifierReference_ in an object destructuring's _AssignmentProperty_ would be collecting all the properties into a new object except BindingPropertyNames of _AssignmentPropertyList_.

### Issues ###

Only own properties are listed in the rest object. This means that explicitly listing out properties have different semantics.

```javascript
let { x, ...z } = n, y = z.y;
```
is not equivalent to:
```javascript
let { x, y, ...z } = n;
```

Getters are executed rather than copying the descriptors over. The prototype is lost.

### Prior Art ###

__Successor-ML__
```ml
val { x = x, y = y, ... = z } = obj
```
http://successor-ml.org/index.php?title=Functional_record_extension_and_row_capture

Mentioned on the destructuring assignment wiki in previous discussions:

http://wiki.ecmascript.org/doku.php?id=discussion:destructuring_assignment#successor-ml_and_row_capture

http://wiki.ecmascript.org/doku.php?id=harmony:destructuring#issues