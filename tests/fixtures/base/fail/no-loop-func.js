// rule: no-loop-func
// expect: eslint(no-loop-func)
// Function created inside loop closes over 'var i'
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs.push(function () {
        return i;
    });
}
console.log(funcs);
