// rule: typescript/array-type ["error", {"default": "array-simple", "readonly": "array-simple"}]
// expect: typescript-eslint(array-type)
// Simple types should use T[] notation, not Array<T>
const names: Array<string> = ['Alice', 'Bob'];
const ids: ReadonlyArray<number> = [1, 2, 3];

export { names, ids };
