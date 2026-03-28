// rule: eqeqeq ["always", {"null": "ignore"}]
// expect: eslint(eqeqeq)
// With allow-null semantics, typeof comparisons with == are NOT allowed
function checkType(value) {
    if (typeof value == 'string') {
        return 'string';
    }
    return 'other';
}
console.log(checkType('x'));
