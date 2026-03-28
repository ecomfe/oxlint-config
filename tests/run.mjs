#!/usr/bin/env node
/**
 * Test runner for oxlint-config
 *
 * Verifies that each modified/added rule:
 *   - Triggers the expected diagnostic on "fail" fixture files
 *   - Does NOT trigger the rule on "pass" fixture files
 */
import {spawnSync} from 'node:child_process';
import {writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
    configure,
    createBaseConfig,
    createTypeScriptConfig,
    createReactConfig,
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OXLINT = path.join(ROOT, 'node_modules/.bin/oxlint');
const FIXTURES = path.join(__dirname, 'fixtures');
const TEST_CONFIGS = path.join(ROOT, '.test-configs');

// ─── Create test configs ──────────────────────────────────────────────────────

mkdirSync(TEST_CONFIGS, {recursive: true});

// Generate JSON configs from TS
const configs = {
    'base.json': createBaseConfig(),
    'base-strict.json': createBaseConfig({strict: true}),
    'typescript.json': createTypeScriptConfig(),
    'typescript-strict.json': createTypeScriptConfig({strict: true}),
    'react.json': createReactConfig(),
    'react-strict.json': createReactConfig({strict: true}),
};

for (const [filename, config] of Object.entries(configs)) {
    writeFileSync(
        path.join(TEST_CONFIGS, filename),
        JSON.stringify(config, null, 2)
    );
}

// ─── Counters ─────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function runOxlint(configRelPath, fileAbsPath) {
    const result = spawnSync(
        OXLINT,
        ['--config', configRelPath, '--format', 'json', fileAbsPath],
        {encoding: 'utf8', cwd: ROOT}
    );
    const raw = (result.stdout || '').trim();
    if (!raw.startsWith('{')) {
        return {diagnostics: [], parseError: (result.stderr || raw).split('\n')[2] || raw};
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return {diagnostics: [], parseError: raw.slice(0, 200)};
    }
}

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    }
    catch (e) {
        console.error(`  ❌ ${name}`);
        console.error(`     ${e.message}`);
        failures.push({name, error: e.message});
        failed++;
    }
}

/**
 * Assert that running oxlint on `file` with `config` produces a diagnostic
 * whose `code` field matches `ruleCode`.
 */
function shouldFail(name, config, file, ruleCode) {
    test(name, () => {
        const result = runOxlint(config, path.join(FIXTURES, file));
        if (result.parseError) {
            throw new Error(`Config parse error: ${result.parseError}`);
        }
        const codes = result.diagnostics.map(d => d.code);
        if (!codes.includes(ruleCode)) {
            throw new Error(
                `Expected rule "${ruleCode}" but got: [${codes.join(', ') || '(none)'}]`
            );
        }
    });
}

/**
 * Assert that running oxlint on `file` with `config` does NOT produce a
 * diagnostic whose `code` field matches `ruleCode`.
 */
function shouldPass(name, config, file, ruleCode) {
    test(name, () => {
        const result = runOxlint(config, path.join(FIXTURES, file));
        if (result.parseError) {
            throw new Error(`Config parse error: ${result.parseError}`);
        }
        const codes = result.diagnostics.map(d => d.code);
        if (codes.includes(ruleCode)) {
            throw new Error(`Rule "${ruleCode}" should NOT trigger but it did.`);
        }
    });
}

// ─── Test Suites ──────────────────────────────────────────────────────────────

// ── Base rules ────────────────────────────────────────────────────────────────
console.log('\n📦 Base rules\n');

shouldFail(
    'no-promise-executor-return: Promise executor 不应有 return 值',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/no-promise-executor-return.js',
    'eslint(no-promise-executor-return)'
);

shouldFail(
    'no-unmodified-loop-condition: 循环条件变量未被修改',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/no-unmodified-loop-condition.js',
    'eslint(no-unmodified-loop-condition)'
);

shouldFail(
    'no-loop-func: 循环内创建函数并捕获 var 变量',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/no-loop-func.js',
    'eslint(no-loop-func)'
);

shouldFail(
    'prefer-promise-reject-errors: Promise.reject 应使用 Error 对象',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/prefer-promise-reject-errors.js',
    'eslint(prefer-promise-reject-errors)'
);

shouldFail(
    'eqeqeq [always, null:ignore]: typeof == 字符串应触发',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/eqeqeq.js',
    'eslint(eqeqeq)'
);

shouldPass(
    'eqeqeq [always, null:ignore]: x == null 应被允许',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/pass/eqeqeq-null.js',
    'eslint(eqeqeq)'
);

shouldFail(
    'no-use-before-define [functions:true]: 函数在定义前使用应报错',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/fail/no-use-before-define.ts',
    'eslint(no-use-before-define)'
);

shouldPass(
    'no-use-before-define [variables:false, classes:false]: 变量/类提前使用应被允许',
    path.join(TEST_CONFIGS, 'base.json'),
    'base/pass/no-use-before-define-vars-ok.ts',
    'eslint(no-use-before-define)'
);

// ── Base strict rules ─────────────────────────────────────────────────────────
console.log('\n📦 Base strict rules\n');

shouldFail(
    'complexity [warn,10]: 圈复杂度超过 10 应警告',
    path.join(TEST_CONFIGS, 'base-strict.json'),
    'base-strict/fail/complexity.js',
    'eslint(complexity)'
);

shouldFail(
    'max-statements [warn,30]: 嵌套函数超过 30 条语句应警告',
    path.join(TEST_CONFIGS, 'base-strict.json'),
    'base-strict/fail/max-statements.js',
    'eslint(max-statements)'
);

shouldPass(
    'max-statements [ignoreTopLevelFunctions:true]: 顶层函数应被忽略',
    path.join(TEST_CONFIGS, 'base-strict.json'),
    'base-strict/pass/max-statements-toplevel.js',
    'eslint(max-statements)'
);

// ── React rules ───────────────────────────────────────────────────────────────
console.log('\n📦 React rules\n');

shouldFail(
    'react/jsx-no-duplicate-props: 精确重复的 prop 应报错',
    path.join(TEST_CONFIGS, 'react.json'),
    'react/fail/jsx-no-duplicate-props.jsx',
    'eslint-plugin-react(jsx-no-duplicate-props)'
);

shouldPass(
    'react/jsx-no-constructed-context-values: base 中为 off，不应触发',
    path.join(TEST_CONFIGS, 'react.json'),
    'react/pass/jsx-no-constructed-context-values.jsx',
    'eslint-plugin-react(jsx-no-constructed-context-values)'
);

// ── React strict rules ────────────────────────────────────────────────────────
console.log('\n📦 React strict rules\n');

shouldFail(
    'react/jsx-no-constructed-context-values: strict 中为 warn，应触发',
    path.join(TEST_CONFIGS, 'react-strict.json'),
    'react-strict/fail/jsx-no-constructed-context-values.jsx',
    'eslint-plugin-react(jsx-no-constructed-context-values)'
);

// ── TypeScript rules ──────────────────────────────────────────────────────────
console.log('\n📦 TypeScript rules\n');

shouldFail(
    'typescript/adjacent-overload-signatures: 重载签名不相邻应报错',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/adjacent-overload-signatures.ts',
    'typescript-eslint(adjacent-overload-signatures)'
);

shouldFail(
    'typescript/array-type [array-simple]: Array<T> 用于简单类型应报错',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/array-type.ts',
    'typescript-eslint(array-type)'
);

shouldFail(
    'typescript/consistent-generic-constructors: 类型参数应在构造函数上',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/consistent-generic-constructors.ts',
    'typescript-eslint(consistent-generic-constructors)'
);

shouldFail(
    'typescript/consistent-type-assertions: 角括号断言应使用 as',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/consistent-type-assertions.ts',
    'typescript-eslint(consistent-type-assertions)'
);

shouldFail(
    'typescript/consistent-type-definitions [interface]: type 对象类型应改为 interface',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/consistent-type-definitions.ts',
    'typescript-eslint(consistent-type-definitions)'
);

shouldFail(
    'typescript/no-empty-interface: 空 interface 应警告',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-empty-interface.ts',
    'typescript-eslint(no-empty-interface)'
);

shouldFail(
    'typescript/no-extraneous-class: 仅包含静态成员的 class 应报错',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-extraneous-class.ts',
    'typescript-eslint(no-extraneous-class)'
);

shouldFail(
    'typescript/no-import-type-side-effects: 仅导入类型时应用 import type',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-import-type-side-effects.ts',
    'typescript-eslint(no-import-type-side-effects)'
);

shouldFail(
    'typescript/no-namespace: namespace 应被禁止',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-namespace.ts',
    'typescript-eslint(no-namespace)'
);

shouldFail(
    'typescript/no-non-null-assertion: ! 断言操作符应被禁止',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-non-null-assertion.ts',
    'typescript-eslint(no-non-null-assertion)'
);

shouldFail(
    'typescript/no-require-imports: require() 调用应使用 import',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/no-require-imports.ts',
    'typescript-eslint(no-require-imports)'
);

shouldFail(
    'typescript/prefer-as-const: 字面量类型断言应使用 as const',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/prefer-as-const.ts',
    'typescript-eslint(prefer-as-const)'
);

shouldFail(
    'typescript/prefer-enum-initializers: 枚举成员应有显式初始值',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/prefer-enum-initializers.ts',
    'typescript-eslint(prefer-enum-initializers)'
);

shouldFail(
    'typescript/prefer-for-of: 仅用下标访问元素时应使用 for-of',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/prefer-for-of.ts',
    'typescript-eslint(prefer-for-of)'
);

shouldFail(
    'typescript/prefer-function-type: 单调用签名 interface 应改为函数类型',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/prefer-function-type.ts',
    'typescript-eslint(prefer-function-type)'
);

shouldFail(
    'typescript/prefer-ts-expect-error: @ts-ignore 应改为 @ts-expect-error',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/prefer-ts-expect-error.ts',
    'typescript-eslint(prefer-ts-expect-error)'
);

shouldFail(
    'typescript/triple-slash-reference: /// <reference> 应改为 import',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/triple-slash-reference.ts',
    'typescript-eslint(triple-slash-reference)'
);

shouldFail(
    'typescript/unified-signatures: 可合并的重载签名应统一',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/fail/unified-signatures.ts',
    'typescript-eslint(unified-signatures)'
);

shouldPass(
    'typescript/valid-typescript.ts: 合规代码不应触发 TypeScript 规则违规',
    path.join(TEST_CONFIGS, 'typescript.json'),
    'typescript/pass/valid-typescript.ts',
    'typescript-eslint'
);

// ── TypeScript strict rules ───────────────────────────────────────────────────
console.log('\n📦 TypeScript strict rules\n');

shouldFail(
    'typescript/ban-ts-comment: strict 下 @ts-ignore 应触发警告',
    path.join(TEST_CONFIGS, 'typescript-strict.json'),
    'typescript-strict/fail/ban-ts-comment.ts',
    'typescript-eslint(ban-ts-comment)'
);

shouldFail(
    'typescript/consistent-type-imports: strict 下类型导入应用 import type',
    path.join(TEST_CONFIGS, 'typescript-strict.json'),
    'typescript-strict/fail/consistent-type-imports.ts',
    'typescript-eslint(consistent-type-imports)'
);

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(`\n结果: ${passed} 通过, ${failed} 失败\n`);

if (failures.length > 0) {
    console.error('失败的测试:');
    failures.forEach(f => console.error(`  • ${f.name}\n    ${f.error}`));
    process.exit(1);
}
