### CopyDataProperties (target, source, excluded) ###

NOTE: These spec proposals refer to the abstract operation CopyDataProperties (`target`, `source`, `excluded`) which follow similar semantics as Object.assign(`target`, `...sources`) in the ES6 spec with the addition of the `excluded` argument which is a list of property names to be excluded. It also uses the CreateDataProperty instead of Put.

1. Assert: Type(`target`) is Object.
2. ReturnIfAbrupt(`target`).
3. If `source` is __undefined__ or __null__, let `keys` be an empty List.
4. Else,
  1. Let `from` be ToObject(`source`).
  2. Let `keys` be `from`.[[OwnPropertyKeys]]().
  3. ReturnIfAbrupt(`keys`).
5. Repeat for each element `nextKey` of `keys` in List order,
  1. Let `desc` be `from`.[[GetOwnProperty]](`nextKey`).
  2. ReturnIfAbrupt(`desc`).
  3. if `desc` is not __undefined__ and `desc`.[[Enumerable]] is __true__ and `nextKey` is not contained in `excluded`, then
    1. Let `propValue` be Get(`from`, `nextKey`).
    2. ReturnIfAbrupt(`propValue`).
    3. Let `status` be CreateDataProperty(`target`, `nextKey`, `propValue`).
    4. ReturnIfAbrupt(`status`).
6. Return `target`.
