Object Spread Initializer
-------------------------

[Specification](https://tc39.es/proposal-object-rest-spread/)

### Examples ###

__Shallow Clone (excluding prototype)__
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

__Overriding Properties__
```javascript
let aWithOverrides = { ...a, x: 1, y: 2 };
// equivalent to
let aWithOverrides = { ...a, ...{ x: 1, y: 2 } };
// equivalent to
let x = 1, y = 2, aWithOverrides = { ...a, x, y };
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
let aWithXGetter = { ...a, get x() { throw new Error('not thrown yet') } };
```
_Desugars into:_
```javascript
let aWithXGetter = {};
Object.assign(aWithXGetter, a);
Object.defineProperty(aWithXGetter, "x", {
  get(){ throw new Error('not thrown yet') },
  enumerable : true,
  configurable : true
});
```

__Getters in the Spread Object__
```javascript
// Throws because the .x property of the inner object is evaluated when the
// property value is copied over to the surrounding object initializer.
let runtimeError = { ...a, ...{ get x() { throw new Error('thrown now') } } };
```

__Setters Are Not Executed When They're Redefined__
```javascript
let z = { set x() { throw new Error(); }, ...{ x: 1 } }; // No error
```

__Null/Undefined Are Ignored__
```javascript
let emptyObject = { ...null, ...undefined }; // no runtime error
```

__Updating Deep Immutable Object__
```javascript
let newVersion = {
  ...previousVersion,
  name: 'New Name', // Override the name property
  address: { ...previousVersion.address, zipCode: '99999' } // Update nested zip code
  items: [...previousVersion.items, { title: 'New Item' }] // Add an item to the list of items
};
```

### Prior Art ###

__Successor-ML__
```ml
{ ... = a, x = 1, y = 2 }
```
http://successor-ml.org/index.php?title=Functional_record_extension_and_row_capture

__Elm__
```elm
{ a | x <- 1, y <- 2 }
```
http://elm-lang.org/learn/Records.elm#updating-records

__OCaml__
```ocaml
{ a with x = 1; y = 2 }
```
https://realworldocaml.org/v1/en/html/records.html#functional-updates

__Haskell__
```haskell
a { x = 1, y = 2 }
```
http://www.haskell.org/haskellwiki/Default_values_in_records
