// These patterns should NOT trigger any TypeScript rule violations

// adjacent-overload-signatures: overloads ARE adjacent
interface Formatter {
    format(value: number): string;
    format(value: string): string;
    log(message: string): void;
}

// array-type: using T[] for simple types is correct
const names: string[] = ['Alice', 'Bob'];
const ids: readonly number[] = [1, 2, 3];

// consistent-generic-constructors: type param on constructor
const map = new Map<string, number>();

// consistent-type-definitions: using interface (not type) for objects
interface UserProfile {
    id: number;
    name: string;
}

// no-non-null-assertion: using optional chaining instead
function getLength(str: string | null): number {
    return str?.length ?? 0;
}

// prefer-as-const: using 'as const' correctly
const direction = 'left' as const;

// prefer-enum-initializers: enum members have explicit values
enum Status {
    Active = 'active',
    Inactive = 'inactive',
}

// prefer-for-of: using for-of when index not needed
for (const name of names) {
    console.log(name);
}

// prefer-function-type: using function type alias (not single-call interface)
type Comparator = (a: number, b: number) => number;

// no-namespace: using module pattern instead
const MathUtils = {
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b,
};

export type { Formatter, UserProfile, Comparator };
export { names, ids, map, direction, Status, MathUtils, getLength };
