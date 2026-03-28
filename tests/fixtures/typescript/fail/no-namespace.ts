// rule: typescript/no-namespace
// expect: typescript-eslint(no-namespace)
// TypeScript namespaces are discouraged; use ES modules instead
namespace Geometry {
    export interface Point {
        x: number;
        y: number;
    }

    export function distance(a: Point, b: Point): number {
        return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
    }
}

export type { Geometry };
