// rule: typescript/prefer-for-of
// expect: typescript-eslint(prefer-for-of)
// When the index is only used to access array elements, use for-of instead
const items = ['a', 'b', 'c'];
for (let i = 0; i < items.length; i++) {
    console.log(items[i]);
}
