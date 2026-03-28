// rule: typescript/unified-signatures
// expect: typescript-eslint(unified-signatures)
// Overloads that can be unified into one signature using union types should be unified
function process(value: string): void;
function process(value: number): void;
function process(value: string | number): void {
    console.log(value);
}

export { process };
