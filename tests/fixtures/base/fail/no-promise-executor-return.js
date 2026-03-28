// rule: no-promise-executor-return
// expect: eslint(no-promise-executor-return)
// Promise executor should not have a return value
const p = new Promise((resolve) => {
    return 1;
});
console.log(p);
