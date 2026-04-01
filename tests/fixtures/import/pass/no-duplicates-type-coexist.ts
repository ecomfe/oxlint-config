// rule: import/no-duplicates
// expect: no warning
// 普通 import 和 import type 来自同一个库时，不应该被 warn
import {foo} from './some-module';
import type {Bar} from './some-module';

export {foo};
export type {Bar};
