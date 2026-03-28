// rule: typescript/no-import-type-side-effects
// expect: typescript-eslint(no-import-type-side-effects)
// When only importing types, use 'import type' to avoid side effects
import { type Foo } from './some-module';

export type { Foo };
