Introduction
------------

### Rest Properties ###

```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x; // 1
y; // 2
z; // { a: 3, b: 4 }
```

### Spread Properties ###

```javascript
let n = { x, y, ...z };
n; // { x: 1, y: 2, a: 3, b: 4 }
```
