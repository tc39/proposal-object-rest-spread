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
3. ReturnIfAbrupt(`fromValue`).
4. Let `excludedNames` be a new empty __List__.
5. Return [CopyDataProperties(`object`, `fromValue`, `excludedNames`)](#copydataproperties-target-source-excluded).

## Rest Properties

### Syntax ###

ObjectAssignmentPattern:
- `{` `...` DestructuringAssignmentTarget `}`
- `{` AssignmentPropertyList `,` `...` DestructuringAssignmentTarget `}`

ObjectBindingPattern:
- `{` `...` BindingIdentifier `}`
- `{` BindingPropertyList `,` `...` BindingIdentifier `}`

### Runtime Semantics: DestructuringAssignmentEvaluation ###

With parameter `value`.

_ObjectAssignmentPattern: `{` `...` DestructuringAssignmentTarget `}`_

1. Let `excludedNames` be a new empty __List__.
2. If DestructuringAssignmentTarget is neither an ObjectLiteral nor an ArrayLiteral, then
  1. Let `lref` be the result of evaluating DestructuringAssignmentTarget.
  2. ReturnIfAbrupt(`lref`).
3. Let `restObj` be ObjectCreate(%ObjectPrototype%).
4. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
5. ReturnIfAbrupt(`assignStatus`).
6. If DestructuringAssignmentTarget is neither an ObjectLiteral nor an ArrayLiteral, then
  1. Return PutValue(`lref`, `restObj`).
7. Let nestedAssignmentPattern be the parse of the source text corresponding to DestructuringAssignmentTarget using either AssignmentPattern or AssignmentPattern[Yield] as the goal symbol depending upon whether this AssignmentElement has the Yield parameter.
8. Return the result of performing DestructuringAssignmentEvaluation of nestedAssignmentPattern with `restObj` as the argument.

_ObjectAssignmentPattern: `{` AssignmentPropertyList `,` `...` DestructuringAssignmentTarget `}`_

1. Let `excludedNames` be the result of performing RestObjectDestructuringAssignmentEvaluation for _AssignmentPropertyList_ using `value` as the argument.
2. ReturnIfAbrupt(`excludedNames`).
3. If DestructuringAssignmentTarget is neither an ObjectLiteral nor an ArrayLiteral, then
  1. Let `lref` be the result of evaluating DestructuringAssignmentTarget.
  2. ReturnIfAbrupt(`lref`).
4. Let `restObj` be ObjectCreate(%ObjectPrototype%).
5. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
6. ReturnIfAbrupt(`assignStatus`).
7. If DestructuringAssignmentTarget is neither an ObjectLiteral nor an ArrayLiteral, then
  1. Return PutValue(`lref`, `restObj`).
8. Let nestedAssignmentPattern be the parse of the source text corresponding to DestructuringAssignmentTarget using either AssignmentPattern or AssignmentPattern[Yield] as the goal symbol depending upon whether this AssignmentElement has the Yield parameter.
9. Return the result of performing DestructuringAssignmentEvaluation of nestedAssignmentPattern with `restObj` as the argument.

### Runtime Semantics: RestObjectDestructuringAssignmentEvaluation

With parameter `value`.

NOTE: This is the same as the ES2015 DestructuringAssignmentEvaluation except it collects a list of all destructured property names.

_AssignmentPropertyList : AssignmentPropertyList `,` AssignmentProperty_

1. Let `propertyNames` be the result of performing RestObjectDestructuringAssignmentEvaluation for AssignmentPropertyList using value as the argument.
2. ReturnIfAbrupt(status).
3. Let `nextNames` be the result of performing RestObjectDestructuringAssignmentEvaluation for AssignmentProperty using `value` as the argument.
4. ReturnIfAbrupt(`nextNames`).
5. Append each item in `nextNames` to the end of `propertyNames`.
6. Return `propertyNames`.

_AssignmentProperty : IdentifierReference Initializer_

1. Let `P` be StringValue of _IdentifierReference_.
2. Let `lref` be ResolveBinding(P).
3. ReturnIfAbrupt(`P`).
4. Let `v` be GetV(`value`, `P`).
5. ReturnIfAbrupt(`v`).
6. If _Initializer_ is present and `v` is __undefined__, then
  1. Let `defaultValue` be the result of evaluating _Initializer_.
  2. Let `v` be GetValue(`defaultValue`).
  3. ReturnIfAbrupt(`v`).
  4. If IsAnonymousFunctionDefinition(_Initializer_) is __true__, then
    1. Let `hasNameProperty` be HasOwnProperty(`v`, "name").
    2. ReturnIfAbrupt(`hasNameProperty`).
    3. If `hasNameProperty` is __false__, perform SetFunctionName(`v`, `P`).
7. Let `status` be the result of evaluating PutValue(`lref`,`v`).
8. ReturnIfAbrupt(`status`).
9. Return a new __List__ containing `P`.

_AssignmentProperty : PropertyName `:` AssignmentElement_

1. Let `name` be the result of evaluating PropertyName.
2. ReturnIfAbrupt(`name`).
3. Let `status` be the result of performing KeyedDestructuringAssignmentEvaluation of AssignmentElement with `value` and `name` as the arguments.
4. ReturnIfAbrupt(`status`).
5. Return a new __List__ containing `name`.

### Runtime Semantics: BindingInitialization ###

With parameters `value` and `environment`.

_ObjectBindingPattern : `{` `...` BindingIdentifier `}`_

1. Let `excludedNames` be a new empty __List__.
2. Let `restObj` be ObjectCreate(%ObjectPrototype%).
3. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
4. ReturnIfAbrupt(`assignStatus`).
5. Let `bindingId` be StringValue of BindingIdentifier.
6. Let `lhs` be ResolveBinding(`bindingId`, `environment`).
7. ReturnIfAbrupt(`lhs`).
8. If `environment` is __undefined__, return PutValue(`lhs`, `restObj`).
9. Return InitializeReferencedBinding(`lhs`, `restObj`).

_ObjectBindingPattern : `{` BindingPropertyList `,` `...` BindingIdentifier `}`_

1. Let `excludedNames` be the result of performing RestObjectBindingInitialization of _BindingPropertyList_ using `value` and `environment` as arguments.
2. ReturnIfAbrupt(`excludedNames`).
3. Let `restObj` be ObjectCreate(%ObjectPrototype%).
4. Let `assignStatus` be [CopyDataProperties(`restObj`, `value`, `excludedNames`)](#copydataproperties-target-source-excluded).
5. ReturnIfAbrupt(`assignStatus`).
6. Let `bindingId` be StringValue of BindingIdentifier.
7. Let `lhs` be ResolveBinding(`bindingId`, `environment`).
8. ReturnIfAbrupt(`lhs`).
9. If `environment` is __undefined__, return PutValue(`lhs`, `restObj`).
10. Return InitializeReferencedBinding(`lhs`, `restObj`).

### Runtime Semantics: RestObjectBindingInitialization

With parameters `value` and `environment`.

NOTE: This is the same as the ES2015 BindingInitialization except it collects a list of all bound property names.

_BindingPropertyList : BindingPropertyList `,` BindingProperty_

1. Let `boundNames` be the result of performing RestObjectBindingInitialization for BindingPropertyList using `value` and `environment` as arguments.
2. ReturnIfAbrupt(`boundNames`).
3. Let `nextNames` be the result of performing RestObjectBindingInitialization for BindingProperty using value and environment as arguments.
4. ReturnIfAbrupt(`nextNames`).
5. Append each item in `nextNames` to the end of `boundNames`.
6. Return `boundNames`.

_BindingProperty : SingleNameBinding_

1. Let `name` be the string that is the only element of BoundNames of SingleNameBinding.
2. Let `status` be the result of performing KeyedBindingInitialization for SingleNameBinding using `value`, `environment`, and `name` as the arguments.
3. ReturnIfAbrupt(`status`).
4. Return a new __List__ containing 'name'.

_BindingProperty : PropertyName `:` BindingElement_

1. Let `P` be the result of evaluating PropertyName
2. ReturnIfAbrupt(`P`).
3. Let `status` be the result of performing KeyedBindingInitialization for BindingElement using `value`, `environment`, and `P` as arguments.
4. ReturnIfAbrupt(`status`).
5. Return a new __List__ containing `P`.

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
