// rule: eqeqeq ["always", {"null": "ignore"}]
// expect: NO eqeqeq violation
// null comparisons with == are explicitly allowed (null: "ignore")
function isNullish(value) {
    return value == null;
}

function isNotNullish(value) {
    return value != null;
}

console.log(isNullish(null), isNotNullish(undefined));
