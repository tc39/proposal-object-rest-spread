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

### Runtime Semantics: DestructuringAssignmentEvaluation ###

_ObjectAssignmentPattern: `{` `...` IdentifierReference `}`_

1. Let `excludedNames` be a new empty __List__.
2. Let `restObj` be ObjectCreate(%ObjectPrototype%).
3. Let `assignStatus` be [CopyDataProperties(`restObj`, `obj`, `excludedNames`)](CopyDataProperties.md).
4. ReturnIfAbrupt(`assignStatus`).
5. Let `P` be StringValue of IdentifierReference.
6. Let `lref` be ResolveBinding(`P`).
7. Return PutValue(`lref`,`restObj`).

_ObjectAssignmentPattern: `{` AssignmentPropertyList `,` `...` IdentifierReference `}`_

1. Let `excludedNames` be AssignmentPropertyNames of _AssignmentPropertyList_.
2. Let `status` be the result of performing DestructuringAssignmentEvaluation for _AssignmentPropertyList_ using `obj` as the argument.
3. ReturnIfAbrupt(`status`).
4. Let `restObj` be ObjectCreate(%ObjectPrototype%).
5. Let `assignStatus` be [CopyDataProperties(`restObj`, `obj`, `excludedNames`)](CopyDataProperties.md).
6. ReturnIfAbrupt(`assignStatus`).
7. Let `P` be StringValue of IdentifierReference.
8. Let `lref` be ResolveBinding(`P`).
9. Return PutValue(`lref`,`restObj`).

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

### Runtime Semantics: BindingInitialization ###

With parameters `value` and `environment`.

_ObjectBindingPattern : `{` `...` BindingIdentifier `}`_

1. Let `excludedNames` be a new empty __List__.
2. Let `restObj` be ObjectCreate(%ObjectPrototype%).
3. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](CopyDataProperties.md).
4. ReturnIfAbrupt(`assignStatus`).
5. Return the result of performing BindingInitialization for _BindingIdentifier_ using `restObj` and `environment` as arguments.

_ObjectBindingPattern : `{` BindingPropertyList `,` `...` BindingIdentifier `}`_

1. Let `excludedNames` be BindingPropertyNames of _BindingPropertyList_.
2. Let `status` be the result of performing BindingInitialization for _BindingPropertyList_ using `value` and `environment` as arguments.
3. ReturnIfAbrupt(`status`).
4. Let `restObj` be ObjectCreate(%ObjectPrototype%).
5. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](CopyDataProperties.md).
6. ReturnIfAbrupt(`assignStatus`).
7. Return the result of performing BindingInitialization for _BindingIdentifier_ using `restObj` and `environment` as arguments.

### Prior Art ###

__Successor-ML__
```ml
val { x = x, y = y, ... = z } = obj
```
http://successor-ml.org/index.php?title=Functional_record_extension_and_row_capture

Mentioned on the destructuring assignment wiki in previous discussions:

http://wiki.ecmascript.org/doku.php?id=discussion:destructuring_assignment#successor-ml_and_row_capture

http://wiki.ecmascript.org/doku.php?id=harmony:destructuring#issues
