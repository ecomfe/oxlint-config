// rule: typescript/prefer-ts-expect-error
// expect: typescript-eslint(prefer-ts-expect-error)
// Use @ts-expect-error instead of @ts-ignore to get an error when the issue is fixed

// @ts-ignore
const x: string = 42;

export { x };
