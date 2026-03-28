// rule: no-use-before-define {functions: true, variables: false, classes: false}
// expect: eslint(no-use-before-define)
// Using a function before its declaration is an error (functions: true)
const result = greet('world');
console.log(result);

function greet(name: string): string {
    return `Hello, ${name}!`;
}
