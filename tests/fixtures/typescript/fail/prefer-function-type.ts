// rule: typescript/prefer-function-type
// expect: typescript-eslint(prefer-function-type)
// Single-call interfaces should be written as function types
interface Comparator {
    (a: number, b: number): number;
}

export type { Comparator };
