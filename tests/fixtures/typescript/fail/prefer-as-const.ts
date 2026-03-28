// rule: typescript/prefer-as-const
// expect: typescript-eslint(prefer-as-const)
// Use 'as const' instead of literal type assertion for literal values
const direction = 'left' as 'left';
const count = 42 as 42;

export { direction, count };
