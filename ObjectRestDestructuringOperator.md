### Destructuring ###

This proposal could be expanded with a parallel destructuring proposal. The runtime semantics of `...` _DestructuringAssignmentTarget_ in an object destructuring's _AssignmentProperty_ would be collecting all the remaining properties into a new object.

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }

let n = { x, y, ...z };
n; // { x: 1, y: 2, a: 3, b: 4 }
```