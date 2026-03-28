// rule: typescript/adjacent-overload-signatures
// expect: typescript-eslint(adjacent-overload-signatures)
// Overloads of the same function must be adjacent (grouped together)
interface Formatter {
    format(value: number): string;
    log(message: string): void;
    format(value: string): string;
}

export type { Formatter };
