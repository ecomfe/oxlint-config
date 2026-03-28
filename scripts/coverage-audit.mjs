#!/usr/bin/env node
/**
 * scripts/coverage-audit.mjs
 *
 * 审计 oxlint-config 的规则覆盖率：
 *   1. 从 `oxlint --rules` 获取全部可用规则（全集）
 *   2. 调用 dist/ 中的工厂函数（strict: false 和 strict: true 两种模式）获取已配置规则
 *   3. 对比两者，找出 "全集中有、但配置文件里未显式声明" 的规则
 *   4. 输出报告到 coverage-report.md
 *
 * 用法：
 *   node scripts/coverage-audit.mjs              # 只报告，不修改文件
 *   node scripts/coverage-audit.mjs --plugins eslint,typescript  # 只审计指定插件
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OXLINT = path.join(ROOT, 'node_modules/.bin/oxlint');

// ─── CLI 参数 ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const PLUGINS_ARG = args.find(a => a.startsWith('--plugins=')) ?? args[args.indexOf('--plugins') + 1];
const ONLY_PLUGINS = PLUGINS_ARG && !PLUGINS_ARG.startsWith('--')
    ? new Set(PLUGINS_ARG.split(',').map(s => s.trim()))
    : null;

// ─── 插件配置映射 ─────────────────────────────────────────────────────────────
//
// 说明：
//   distFile    — 对应的编译产物路径（相对于 ROOT）
//   createFn    — 工厂函数名称（从 distFile 导入）
//   prefix      — 规则名的插件前缀（eslint 规则无前缀）
//   dummyExt    — 传给 --print-config 的虚拟文件扩展名

const PLUGIN_MAP = {
    eslint: {
        distFile: 'dist/base.js',
        createFn: 'createBaseConfig',
        prefix: '',
        dummyExt: 'js',
    },
    typescript: {
        distFile: 'dist/typescript.js',
        createFn: 'createTypeScriptConfig',
        prefix: 'typescript/',
        dummyExt: 'ts',
    },
    react: {
        distFile: 'dist/react.js',
        createFn: 'createReactConfig',
        prefix: 'react/',
        dummyExt: 'jsx',
    },
    import: {
        distFile: 'dist/import.js',
        createFn: 'createImportConfig',
        prefix: 'import/',
        dummyExt: 'js',
    },
};

// ─── Step 1: 解析 oxlint --rules 获取全集 ─────────────────────────────────────

function getAllOxlintRules() {
    console.log('获取 oxlint --rules 全集...');
    const result = spawnSync(OXLINT, ['--rules'], {encoding: 'utf8', cwd: ROOT});
    if (result.status !== 0) {
        throw new Error(`oxlint --rules 失败: ${result.stderr}`);
    }

    /** @type {Map<string, string[]>} plugin -> [ruleName, ...] */
    const rulesByPlugin = new Map();

    for (const line of result.stdout.split('\n')) {
        // 匹配表格数据行，格式：| rule-name | source | ... |
        const match = line.match(/^\|\s*([\w/-]+)\s*\|\s*([\w_]+)\s*\|/);
        if (!match) {
            continue;
        }
        const [, ruleName, plugin] = match;
        if (ruleName === 'Rule name') {
            continue; // 表头
        }
        if (!rulesByPlugin.has(plugin)) {
            rulesByPlugin.set(plugin, []);
        }
        rulesByPlugin.get(plugin).push(ruleName.trim());
    }

    const totals = [...rulesByPlugin.entries()]
        .map(([p, r]) => `${p}(${r.length})`)
        .join(', ');
    console.log(`   发现 ${[...rulesByPlugin.values()].reduce((s, r) => s + r.length, 0)} 条规则: ${totals}\n`);

    return rulesByPlugin;
}

// ─── Step 2: 通过工厂函数收集已配置的规则 ────────────────────────────────────

async function getConfiguredRules(pluginName) {
    const cfg = PLUGIN_MAP[pluginName];
    const mod = await import(path.join(ROOT, cfg.distFile));
    const createFn = mod[cfg.createFn];
    const configured = new Set();

    // 同时收集 strict: false 和 strict: true 两种模式下的所有规则键
    for (const strict of [false, true]) {
        const config = createFn({strict});
        for (const key of Object.keys(config.rules ?? {})) {
            const stripped = cfg.prefix
                ? key.replace(new RegExp(`^${cfg.prefix.replace('/', '\\/')}`), '')
                : key;
            configured.add(stripped);
        }
    }

    return configured;
}

// ─── Step 3: 通过 --print-config 获取实际生效配置（用于标注默认状态）─────────

async function getPrintConfigRules(pluginName) {
    const cfg = PLUGIN_MAP[pluginName];
    const mod = await import(path.join(ROOT, cfg.distFile));
    const createFn = mod[cfg.createFn];
    const config = createFn({strict: false});

    const tmpConfig = path.join(ROOT, `_audit_tmp_${pluginName}.json`);
    const dummyFile = path.join(ROOT, `_audit_dummy.${cfg.dummyExt}`);

    fs.writeFileSync(tmpConfig, JSON.stringify(config, null, 2));
    fs.writeFileSync(dummyFile, '');

    try {
        const result = spawnSync(
            OXLINT,
            ['--config', tmpConfig, '--print-config', dummyFile],
            {encoding: 'utf8', cwd: ROOT}
        );

        if (!result.stdout?.trim().startsWith('{')) {
            return new Map();
        }

        const parsed = JSON.parse(result.stdout.trim());
        const rulesMap = new Map(); // ruleName(带前缀) -> "allow"|"warn"|"deny"

        for (const [key, val] of Object.entries(parsed.rules ?? {})) {
            const severity = typeof val === 'string' ? val : (Array.isArray(val) ? val[0] : 'allow');
            rulesMap.set(key, severity);
        }

        return rulesMap;
    }
    finally {
        if (fs.existsSync(tmpConfig)) {
            fs.unlinkSync(tmpConfig);
        }
        if (fs.existsSync(dummyFile)) {
            fs.unlinkSync(dummyFile);
        }
    }
}

// ─── Step 4: 生成报告 ─────────────────────────────────────────────────────────

function generateReport(auditResults) {
    const lines = [];
    lines.push('# oxlint 规则覆盖率审计报告');
    lines.push('');
    lines.push(`> 生成时间：${new Date().toLocaleString('zh-CN')}`);
    lines.push(`> oxlint 版本：${getOxlintVersion()}`);
    lines.push('');

    let totalMissing = 0;

    for (const [plugin, {allRules, configured, missing, printConfigMap}] of auditResults) {
        const coverage = allRules.length > 0
            ? ((configured.size / allRules.length) * 100).toFixed(1)
            : '100.0';

        lines.push(`## ${plugin} 插件`);
        lines.push('');
        lines.push(`- 全集规则数：**${allRules.length}**`);
        lines.push(`- 已配置规则数：**${configured.size}**`);
        lines.push(`- 未配置规则数：**${missing.length}**`);
        lines.push(`- 覆盖率：**${coverage}%**`);
        lines.push('');

        if (missing.length === 0) {
            lines.push('全部规则已覆盖。');
        }
        else {
            lines.push(`### 未配置的规则（共 ${missing.length} 条）`);
            lines.push('');
            lines.push('| 规则名 | 默认状态（--print-config） | 建议配置 |');
            lines.push('|---|---|---|');

            const cfg = PLUGIN_MAP[plugin];
            for (const rule of missing.sort()) {
                const fullKey = cfg.prefix + rule;
                const defaultState = printConfigMap.get(fullKey) ?? '（不在生效配置中）';
                const suggestion = defaultState === 'deny' || defaultState === 'warn'
                    ? '建议显式配置'
                    : '"off"';
                lines.push(`| \`${fullKey}\` | ${defaultState} | ${suggestion} |`);
            }

            totalMissing += missing.length;
        }

        lines.push('');
        lines.push('---');
        lines.push('');
    }

    lines.push('## 汇总');
    lines.push('');
    lines.push(`总计未配置规则：**${totalMissing}** 条`);
    lines.push('');
    if (totalMissing === 0) {
        lines.push('所有审计插件的规则均已覆盖。');
    }

    return lines.join('\n');
}

function getOxlintVersion() {
    const r = spawnSync(OXLINT, ['--version'], {encoding: 'utf8', cwd: ROOT});
    return r.stdout.trim().replace('Version: ', '');
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

async function main() {
    console.log('oxlint 规则覆盖率审计\n');

    // 确定要审计的插件列表
    const pluginsToAudit = ONLY_PLUGINS
        ? [...ONLY_PLUGINS].filter(p => p in PLUGIN_MAP)
        : Object.keys(PLUGIN_MAP);

    if (ONLY_PLUGINS) {
        const unsupported = [...ONLY_PLUGINS].filter(p => !(p in PLUGIN_MAP));
        if (unsupported.length) {
            console.warn(`以下插件未在 PLUGIN_MAP 中配置，已跳过: ${unsupported.join(', ')}`);
        }
    }

    // 获取全集
    const allRulesByPlugin = getAllOxlintRules();

    /** @type {Map<string, object>} */
    const auditResults = new Map();

    for (const plugin of pluginsToAudit) {
        console.log(`审计插件: ${plugin}`);

        const allRules = allRulesByPlugin.get(plugin) ?? [];
        const configured = await getConfiguredRules(plugin);
        const printConfigMap = await getPrintConfigRules(plugin);

        const missing = allRules.filter(r => !configured.has(r));

        console.log(`   全集: ${allRules.length}  已配置: ${configured.size}  缺失: ${missing.length}`);
        if (missing.length > 0) {
            console.log(
                `   缺失规则: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ` 等 ${missing.length} 条` : ''}`
            );
        }

        auditResults.set(plugin, {allRules, configured, missing, printConfigMap});
    }

    // 生成报告
    const report = generateReport(auditResults);
    const reportPath = path.join(ROOT, 'coverage-report.md');
    fs.writeFileSync(reportPath, report, 'utf8');
    console.log('\n报告已写入: coverage-report.md');

    // 控制台汇总
    console.log('\n汇总:');
    let totalMissing = 0;
    for (const [plugin, {allRules, configured, missing}] of auditResults) {
        const pct = allRules.length > 0 ? ((configured.size / allRules.length) * 100).toFixed(1) : '100.0';
        const status = missing.length === 0 ? '[OK]' : '[!!]';
        console.log(
            `   ${status} ${
                plugin.padEnd(12)
            } ${configured.size}/${allRules.length} (${pct}%) — 缺失 ${missing.length} 条`
        );
        totalMissing += missing.length;
    }
    console.log(`\n   总缺失: ${totalMissing} 条`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
