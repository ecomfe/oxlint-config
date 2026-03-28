// rule: typescript/consistent-generic-constructors ["error", "constructor"]
// expect: typescript-eslint(consistent-generic-constructors)
// Type parameter should be on constructor, not type annotation
const map: Map<string, number> = new Map();

export { map };
