// rule: typescript/no-extraneous-class
// expect: typescript-eslint(no-extraneous-class)
// Classes used only as namespaces should be plain objects or modules
class MathUtils {
    static add(a: number, b: number): number {
        return a + b;
    }

    static multiply(a: number, b: number): number {
        return a * b;
    }
}

export { MathUtils };
