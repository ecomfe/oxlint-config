import type {OxlintConfig} from 'oxlint';
import {createBaseConfig, type BaseConfigOptions} from './base.js';
import {createImportConfig, type ImportConfigOptions} from './import.js';
import {createReactConfig, type ReactConfigOptions} from './react.js';
import {createTypeScriptConfig, type TypeScriptConfigOptions} from './typescript.js';

type OmitStrict<T> = Omit<T, 'strict'>;

export interface ConfigureOptions {
    strict?: boolean;
    import?: OmitStrict<ImportConfigOptions>;
    react?: OmitStrict<ReactConfigOptions>;
    typescript?: OmitStrict<TypeScriptConfigOptions>;
}

function mergeWithStrict<T extends {strict?: boolean}>(
    globalStrict: boolean | undefined,
    moduleOptions: Omit<T, 'strict'> | undefined,
): T {
    return {
        strict: globalStrict,
        ...moduleOptions,
    } as T;
}

export function configure(options: ConfigureOptions = {}): OxlintConfig[] {
    const configs: OxlintConfig[] = [
        createBaseConfig({strict: options.strict}),
    ];

    if (options.import) {
        configs.push(createImportConfig(mergeWithStrict(options.strict, options.import)));
    }

    if (options.typescript) {
        configs.push(createTypeScriptConfig(mergeWithStrict(options.strict, options.typescript)));
    }

    if (options.react) {
        configs.push(createReactConfig(mergeWithStrict(options.strict, options.react)));
    }

    return configs;
}

// Re-export individual config creators and their options
export {createBaseConfig, type BaseConfigOptions};
export {createImportConfig, type ImportConfigOptions};
export {createReactConfig, type ReactConfigOptions};
export {createTypeScriptConfig, type TypeScriptConfigOptions};
