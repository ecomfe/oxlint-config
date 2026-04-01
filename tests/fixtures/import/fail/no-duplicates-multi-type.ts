// rule: import/no-duplicates
// expect: eslint-plugin-import(no-duplicates)
// Multiple 'import type' from the same module should be merged into one
import type {TypeA} from './some-module';
import type {TypeB} from './some-module';

export type {TypeA, TypeB};