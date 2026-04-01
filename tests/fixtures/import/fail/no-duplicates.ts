// rule: import/no-duplicates
// expect: import(no-duplicates)
// 同一个库的普通 import 应该合并
import {foo} from './some-module';
import {bar} from './some-module';

export {foo, bar};
