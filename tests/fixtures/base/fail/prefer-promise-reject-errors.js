// rule: prefer-promise-reject-errors
// expect: eslint(prefer-promise-reject-errors)
// Promise.reject should receive an Error object, not a plain string
function handleError() {
    return Promise.reject('something went wrong');
}
console.log(handleError);
