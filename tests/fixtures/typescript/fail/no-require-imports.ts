// rule: typescript/no-require-imports
// expect: typescript-eslint(no-require-imports)
// Use ES module imports instead of CommonJS require()
const fs = require('node:fs');
const path = require('node:path');

export { fs, path };
