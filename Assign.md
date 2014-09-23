### Assign (T, S, E) ###

NOTE: These spec proposals refer to the abstract operation Assign (`T`, `S`, `E`) which follow similar semantics as Object.assign(`T`, `S`) in the ES6 spec with the addition of the `E` argument which is a list of property names to be excluded. It also uses the CreateDataProperty instead of Put.

1. Assert: Type(`T`) is Object.
2. If `S` is __null__ or __undefined__, then let `keys` be an empty List.
3. Else,
  1. Let `from` be ToObject(`S`).
  2. ReturnIfAbrupt(`from`).
  3. Let `keys` be the result of calling the [[OwnPropertyKeys]] internal method of `from`.
  4. ReturnIfAbrupt(`keys`).
4. Let `pendingException` be __undefined__.
5. Repeat for each element nextKey of keys in List order,
  1. Let `desc` be the result of calling the [[GetOwnProperty]] internal method of `from` with argument `nextKey`.
  2. If `desc` is an abrupt completion, then
    1. If `pendingException` is __undefined__, then set `pendingException` to `desc`.
  5. Else if `desc` is not __undefined__ and `desc`.[[Enumerable]] is __true__ and `nextKey` is not contained in `E` then
    1. Let `propValue` be Get(`from`, `nextKey`).
    2. If `propValue` is an abrupt completion, then
      1. If `pendingException` is __undefined__, then set `pendingException` to `propValue`.
    3. else
      1. Let `status` be CreateDataProperty(`T`, `nextKey`, `propValue`);
      2. If `status` is an abrupt completion, then
        1. If `pendingException` is __undefined__, then set `pendingException` to `status`.
  6. Increment `nextIndex` by 1.
6. If `pendingException` is not __undefined__, then return `pendingException`.
7. return __true__
