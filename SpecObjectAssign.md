### Assign (T, S) ###

These spec proposals refer to the abstract operation Assign (`T`, `S`) which follow the same semantics as Object.assign(`T`, `S`) in the ES6 spec.

1. Assert: Type(`T`) is Object.
2. Let `from` be ToObject(`S`).
3. ReturnIfAbrupt(`from`).
4. Let `keysArray` be the result of calling the [[OwnPropertyKeys]] internal method of `fromValue`.
5. ReturnIfAbrupt(`keysArray`).
6. Let `lenValue` be Get(`keysArray`, __"length"__).
7. Let `len` be ToLength(`lenValue`).
8. ReturnIfAbrupt(`len`).
9. Let `nextIndex` be 0.
10. Let `pendingException` be __undefined__.
11. Repeat while `nextIndex` < `len`,
  1. Let `nextKey` be Get(`keysArray`, ToString(`nextIndex`)).
  2. ReturnIfAbrupt(`nextKey`).
  3. Let `desc` be the result of calling the [[GetOwnProperty]] internal method of `from` with argument `nextKey`.
  4. If `desc` is an abrupt completion, then
    1. If `pendingException` is __undefined__, then set `pendingException` to `desc`.
  5. Else if `desc` is not __undefined__ and `desc`.[[Enumerable]] is __true__, then
    1. Let `propValue` be Get(`from`, `nextKey`).
    2. If `propValue` is an abrupt completion, then
      1. If `pendingException` is __undefined__, then set `pendingException` to `propValue`.
    3. else
      1. Let `status` be Put(`T`, `nextKey`, `propValue`, __true__);
      2. If `status` is an abrupt completion, then
        1. If `pendingException` is __undefined__, then set `pendingException` to `status`.
  6. Increment `nextIndex` by 1.
12. If `pendingException` is not __undefined__, then return `pendingException`.
13. return `true`
