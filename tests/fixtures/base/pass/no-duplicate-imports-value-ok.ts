// rule: no-duplicate-imports (off in base config)
// expect: no warning even for plain duplicate value imports
// base config disables the built-in no-duplicate-imports rule; deduplication
// of plain value imports is delegated to the import plugin's no-duplicates rule.
import {foo} from 'some-module';
import {bar} from 'some-module';

export {foo, bar};
