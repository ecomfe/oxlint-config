// rule: typescript/prefer-enum-initializers
// expect: typescript-eslint(prefer-enum-initializers)
// Enum members should have explicit initializers to avoid value shift bugs
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export { Direction };
