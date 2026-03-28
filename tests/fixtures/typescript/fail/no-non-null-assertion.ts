// rule: typescript/no-non-null-assertion
// expect: typescript-eslint(no-non-null-assertion)
// Non-null assertion operator (!) hides potential null/undefined errors
function getLength(str: string | null): number {
    return str!.length;
}

export { getLength };
