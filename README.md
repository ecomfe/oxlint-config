# @ecomfe/oxlint-config

百度 EFE 团队的 Oxlint 配置（从 [ecomfe/eslint-config](https://github.com/ecomfe/eslint-config) 迁移）

## 安装

```bash
npm install -D oxlint @ecomfe/oxlint-config
```

## 使用

在项目根目录创建 `oxlint.config.ts`：

```javascript
import {configure} from '@ecomfe/oxlint-config';
import {defineConfig} from 'oxlint';

export default defineConfig({
    extends: configure({
        strict: true,       // 启用严格模式（可选）
        import: {},         // 启用 import 规则（可选）
        typescript: {},     // 启用 TypeScript 规则（可选）
        react: {},          // 启用 React 规则（可选）
    }),
    // 项目自定义覆盖
    rules: {
        'no-console': 'off',
    },
});
```

按需保留 `configure` 中的选项即可，无需的场景直接删除对应字段。

如需更细粒度控制，可使用独立配置函数：

```javascript
import {createBaseConfig, createTypeScriptConfig, createReactConfig} from '@ecomfe/oxlint-config';
import {defineConfig} from 'oxlint';

export default defineConfig({
    extends: [
        createBaseConfig({strict: true}),
        createTypeScriptConfig(),
        createReactConfig(),
    ],
});
```

### 运行

```bash
npx oxlint .          # 检查代码
npx oxlint . --fix    # 自动修复
```

## 配置项

除 `strict` 外，其余选项均控制特定场景的规则，无该配置即完全禁用相关规则，传入空对象 `{}` 表示按默认配置启用。

- **`strict`**：启用严格模式，提升部分规则的约束。
- **`import`**：模块导入、导出相关规则（约 15+ 条）。
- **`typescript`**：TypeScript 相关规则（约 80+ 条非类型检查规则）。
- **`react`**：React 最佳实践规则（约 50+ 条）。

## 不包含的规则

- **格式化规则**（约 50 条）：建议使用 `dprint` 或 `Prettier`
- **TypeScript 类型检查规则**（约 15 条）：需要类型信息（如 `no-floating-promises`），建议配合 `tsc --strict --noEmit`
- **oxlint 尚未实现的规则**（约 15 条）：详见 [TODO.md](./TODO.md)
