// rule: import/no-duplicates
// expect: no warning
// Merged 'import type' from the same module into a single statement
import type {TypeA, TypeB} from './some-module';

export type {TypeA, TypeB};
