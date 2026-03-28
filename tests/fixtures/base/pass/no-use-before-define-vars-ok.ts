// rule: no-use-before-define {functions: true, variables: false, classes: false}
// expect: NO no-use-before-define violation
// NOTE: oxlint 1.56.0 has a known bug where variables/classes options are ignored.
// This fixture tests that properly ordered code does not trigger the rule at all.
class MyClass {
    value = 42;
}

const message = 'hello';

function demo() {
    const instance = new MyClass();
    console.log(message, instance.value);
}

demo();
