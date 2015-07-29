# Specification

## Spread Properties ##

### Syntax ###

PropertyDefinitionList:
- PropertyDefinition
- PropertyDefinitionList `,` PropertyDefinition

PropertyDefinition:
- `...` AssignmentExpression
- etc.

### Runtime Semantics: PropertyDefinitionEvaluation ###

With parameter `object`.

_PropertyDefinition : `...` AssignmentExpression_

1. Let `exprValue` be the result of evaluating _AssignmentExpression_.
2. Let `fromValue` be GetValue(`exprValue`).
3. If `fromValue` is either __undefined__ or __null__, then return __true__.
4. Let `excludedNames` be a new empty __List__.
5. Return [CopyDataProperties(`object`, `fromValue`, `excludedNames`)](#copydataproperties-target-source-excluded).

## Rest Properties

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
3. Let `assignStatus` be [CopyDataProperties(`restObj`, `obj`, `excludedNames`)](#copydataproperties-target-source-excluded).
4. ReturnIfAbrupt(`assignStatus`).
5. Let `P` be StringValue of IdentifierReference.
6. Let `lref` be ResolveBinding(`P`).
7. Return PutValue(`lref`,`restObj`).

_ObjectAssignmentPattern: `{` AssignmentPropertyList `,` `...` IdentifierReference `}`_

1. Let `excludedNames` be AssignmentPropertyNames of _AssignmentPropertyList_.
2. Let `status` be the result of performing DestructuringAssignmentEvaluation for _AssignmentPropertyList_ using `obj` as the argument.
3. ReturnIfAbrupt(`status`).
4. Let `restObj` be ObjectCreate(%ObjectPrototype%).
5. Let `assignStatus` be [CopyDataProperties(`restObj`, `obj`, `excludedNames`)](#copydataproperties-target-source-excluded).
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
3. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
4. ReturnIfAbrupt(`assignStatus`).
5. Return the result of performing BindingInitialization for _BindingIdentifier_ using `restObj` and `environment` as arguments.

_ObjectBindingPattern : `{` BindingPropertyList `,` `...` BindingIdentifier `}`_

1. Let `excludedNames` be BindingPropertyNames of _BindingPropertyList_.
2. Let `status` be the result of performing BindingInitialization for _BindingPropertyList_ using `value` and `environment` as arguments.
3. ReturnIfAbrupt(`status`).
4. Let `restObj` be ObjectCreate(%ObjectPrototype%).
5. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
6. ReturnIfAbrupt(`assignStatus`).
7. Return the result of performing BindingInitialization for _BindingIdentifier_ using `restObj` and `environment` as arguments.

## CopyDataProperties (target, source, excluded) ##

NOTE: These spec proposals refer to the abstract operation CopyDataProperties (`target`, `source`, `excluded`) which follow similar semantics as Object.assign(`target`, `...sources`) in the ES6 spec with the addition of the `excluded` argument which is a list of property names to be excluded. It also uses the CreateDataProperty instead of Put.

1. Assert: Type(`target`) is Object.
2. ReturnIfAbrupt(`target`).
3. If `source` is __undefined__ or __null__, let `keys` be an empty List.
4. Else,
  1. Let `from` be ToObject(`source`).
  2. Let `keys` be `from`.`[[OwnPropertyKeys]]`().
  3. ReturnIfAbrupt(`keys`).
5. Repeat for each element `nextKey` of `keys` in List order,
  1. Let `desc` be `from`.`[[GetOwnProperty]]`(`nextKey`).
  2. ReturnIfAbrupt(`desc`).
  3. if `desc` is not __undefined__ and `desc`.`[[Enumerable]]` is __true__ and `nextKey` is not contained in `excluded`, then
    1. Let `propValue` be Get(`from`, `nextKey`).
    2. ReturnIfAbrupt(`propValue`).
    3. Let `status` be CreateDataProperty(`target`, `nextKey`, `propValue`).
    4. ReturnIfAbrupt(`status`).
6. Return `target`.
