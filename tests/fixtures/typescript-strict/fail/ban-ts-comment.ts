// rule: typescript/ban-ts-comment (warn in strict mode)
// expect: typescript-eslint(ban-ts-comment)
// In strict mode, @ts-ignore usage is warned
// @ts-ignore
const value: string = 42;

export { value };
