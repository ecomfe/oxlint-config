// rule: typescript/consistent-type-assertions
// expect: typescript-eslint(consistent-type-assertions)
// Angle-bracket type assertions are not allowed; use 'as' instead
declare const someValue: unknown;
const myString = <string>someValue;

export { myString };
