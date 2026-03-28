# oxlint-config TODO List

以下规则来自 `ecomfe/eslint-config`，目前无法直接迁移到本配置中。  
说明列中「不另行实现」表示 oxlint 通常已有替代方案；其余为**尚未实现**，待 oxlint 支持后补充。

---

## Base 规则（`src/base/`）

### 逻辑类规则（非格式化）

| 规则名 | ecomfe/eslint-config 配置 | 说明 |
|---|---|---|
| `no-dupe-args` | `'error'` | 禁止重复函数参数名。oxlint 不另行实现（strict mode 已覆盖，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `no-unreachable-loop` | `'error'` | 禁止循环体只会执行一次 |
| `no-useless-assignment` | `'error'` | 禁止无用赋值 |
| `require-atomic-updates` | `'warn'` | 禁止 async 函数中的竞态条件赋值 |
| `camelcase` | `'error'` | 强制驼峰命名（重要，error 级别）。oxlint 不另行实现（官方建议用 `typescript/naming-convention` 替代，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `dot-notation`（eslint 版） | `['error', {allowKeywords: true, allowPattern: '^catch$'}]` | oxlint 不另行实现 eslint 版（官方建议用 `typescript/dot-notation` 替代，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `no-implied-eval`（eslint 版） | `'warn'` | oxlint 只有 `typescript/no-implied-eval`，无纯 eslint 版 |
| `no-octal` | `'warn'` | 禁止八进制字面量。oxlint 不另行实现（strict mode 已覆盖，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `no-octal-escape` | `'warn'` | 禁止字符串中的八进制转义。oxlint 不另行实现（strict mode 已覆盖，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `no-undef-init` | `'warn'` | 禁止将变量初始化为 undefined。oxlint 不另行实现（`unicorn/no-useless-undefined` 已覆盖，[#479](https://github.com/oxc-project/oxc/issues/479)） |
| `no-underscore-dangle` | `'warn'` | 禁止标识符使用下划线开头/结尾 |
| `one-var` | `['error', 'never']` | 禁止一次声明多个变量（重要，error 级别） |
| `prefer-regex-literals` | `'warn'` | 建议使用正则字面量而非 RegExp 构造函数 |

### Strict 模式下额外规则

| 规则名 | ecomfe/eslint-config strict 配置 | 说明 |
|---|---|---|
| `prefer-arrow-callback` | `['warn', {allowNamedFunctions: true}]` | 建议回调使用箭头函数 |
| `consistent-return`（eslint 版） | `['error', {treatUndefinedAsUnspecified: true}]` | oxlint 不另行实现 eslint 版（官方建议用 `typescript/consistent-return` 替代，[#479](https://github.com/oxc-project/oxc/issues/479)） |

### @stylistic 格式化规则（整类不支持）

oxlint 专注逻辑检查，不处理代码格式化。ecomfe/eslint-config 中约 50 条 `@stylistic/` 规则均无法迁移。  
**建议使用 `dprint` 或 `Prettier` 处理代码格式。**

涉及规则（部分）：`@stylistic/indent`、`@stylistic/quotes`、`@stylistic/semi`、`@stylistic/comma-dangle`、
`@stylistic/max-len`、`@stylistic/object-curly-spacing`、`@stylistic/arrow-parens`、`@stylistic/brace-style`、
`@stylistic/keyword-spacing`、`@stylistic/space-infix-ops` 等。

---

## React 规则（`src/react/`）

| 规则名 | ecomfe/eslint-config 配置 | 说明 |
|---|---|---|
| `react/jsx-no-duplicate-props` (`ignoreCase: true` 选项) | `['error', {ignoreCase: true}]` | oxlint 当前不支持 `ignoreCase` 选项，只能检测精确重复，大小写不同的重复 prop（如 `className` 和 `ClassName`）无法检测 |
| `react/hook-use-state` | `'warn'` | useState 解构变量命名规范 |
| `react/jsx-closing-bracket-location` | `['error', 'line-aligned']` | JSX 结束括号对齐（格式化类） |
| `react/jsx-closing-tag-location` | `'error'` | JSX 结束标签位置（格式化类） |
| `react/jsx-curly-newline` | `['error', {multiline: 'require', singleline: 'forbid'}]` | JSX 花括号换行（格式化类） |
| `react/jsx-curly-spacing` | `['error', 'never']` | JSX 花括号内空格（格式化类） |
| `react/jsx-equals-spacing` | `['error', 'never']` | JSX 属性等号两侧空格（格式化类） |
| `react/jsx-first-prop-new-line` | `['error', 'multiline-multiprop']` | JSX 第一个 prop 换行（格式化类） |
| `react/jsx-indent` | `['error', 4]` | JSX 缩进（格式化类） |
| `react/jsx-indent-props` | `['error', 4]` | JSX props 缩进（格式化类） |
| `react/jsx-max-props-per-line` | `['error', {when: 'multiline'}]` | 每行最多一个 prop（格式化类） |
| `react/jsx-no-bind` | `['warn', {ignoreRefs: true, allowArrowFunctions: false, ...}]` | 禁止在 JSX 中使用 bind/箭头函数 |
| `react/jsx-props-no-multi-spaces` | `'error'` | 禁止 JSX props 之间多余空格（格式化类） |
| `react/jsx-tag-spacing` | `['error', {closingSlash: 'never', beforeSelfClosing: 'always', ...}]` | JSX 标签内空格（格式化类） |
| `react/jsx-uses-vars` | `'error'` | 标记 JSX 使用的变量为已使用。oxlint 不另行实现（`eslint/no-unused-vars` 已处理 JSX 变量，[#1022](https://github.com/oxc-project/oxc/issues/1022)） |
| `react/jsx-uses-react` | `'off'` | 标记 React 为已使用。oxlint 不另行实现（React 17+ 新 JSX transform 无需此规则，[#1022](https://github.com/oxc-project/oxc/issues/1022)） |
| `react/jsx-wrap-multilines` | `['error', {declaration: 'parens-new-line', ...}]` | 多行 JSX 用括号包裹（格式化类） |
| `react/no-deprecated` | `'warn'` | 禁用已废弃的 React API（注意：oxlint 的 `typescript/no-deprecated` 是不同规则） |
| `react/no-unstable-nested-components` | base: `'warn'`, strict: `'error'` | 禁止不稳定的嵌套组件定义 |

---

## Import 规则（`src/import/`）

| 规则名 | ecomfe/eslint-config 配置 | 说明 |
|---|---|---|
| `import/no-deprecated` | `'error'` | 禁止导入已废弃模块。oxlint 不另行实现（`typescript/no-deprecated` via tsgolint 已覆盖，[#1117](https://github.com/oxc-project/oxc/issues/1117)） |
| `import/order` | `['warn', {groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index']}]` | import 排序。oxlint 不另行实现（Oxfmt 的 import sorting 已覆盖，[#1117](https://github.com/oxc-project/oxc/issues/1117)） |
| `import/newline-after-import` | `'error'` | import 后必须空行（格式化类，可用 Oxfmt/prettier 替代） |
| `import/no-useless-path-segments` | `'error'` | 禁止无用的路径片段 |
| `import/no-unresolved` | `'off'` | 检查模块路径是否可解析 |
| `import/no-restricted-paths` | `'off'` | 禁止特定路径的导入 |
| `import/no-internal-modules` | `'off'` | 禁止导入内部模块子路径。oxlint 不另行实现（`eslint/no-restricted-imports` 已覆盖，[#1117](https://github.com/oxc-project/oxc/issues/1117)） |
| `import/no-extraneous-dependencies` | strict: `'error'` | 禁止导入未在 package.json 声明的依赖 |
| `import/no-unused-modules` | `'off'` | 检测未被使用的模块 |
| `dynamic-import-chunkname` | webpack 模式: `'warn'` | webpack 动态导入 chunkname |

---

## TypeScript 规则（`src/typescript/`）

| 规则名 | ecomfe/eslint-config 配置 | 说明 |
|---|---|---|
| `@typescript-eslint/explicit-member-accessibility` | `['error', {accessibility: 'no-public'}]` | 类成员访问修饰符规则 |
| `@typescript-eslint/member-ordering` | `'warn'` | 类成员排序 |
| `@typescript-eslint/no-unnecessary-type-conversion` | `typeCheck ? 'warn' : 'off'` | 禁止不必要的类型转换。oxlint 已有实现（`typescript/no-unnecessary-type-conversion`），但属于 `nursery` 且仅在 `--type-aware` 模式（tsgolint）下生效，暂不纳入 |
| `@typescript-eslint/ban-ts-comment`（复杂选项） | strict: `['warn', {'ts-expect-error': 'allow-with-description', ...}]` | oxlint 有 `typescript/ban-ts-comment` 但选项不完全一致，待对齐 |
| `@typescript-eslint/no-unused-vars` | `['error', {vars: 'all', args: 'after-used', ignoreRestSiblings: true}]` | 无独立 oxlint typescript 版，当前使用 `eslint/no-unused-vars` 代替 |
| `@typescript-eslint/init-declarations` | `'error'`（TS 中覆盖 base） | 无独立 oxlint typescript 版，当前使用 `eslint/init-declarations` 代替 |

---

## 已知 oxlint Bug / 选项未完全实现

| 规则 | 选项 | 说明 |
|---|---|---|
| `no-use-before-define` | `variables: false`, `classes: false` | oxlint 1.56.0 中这两个选项未生效，实际行为等同于 `{variables: true, classes: true}`，比配置意图更严格 |
| `react/jsx-no-duplicate-props` | `ignoreCase: true` | oxlint 不接受该选项（配置时报错），只能检测精确重复，无法检测大小写不同的重复 prop |
