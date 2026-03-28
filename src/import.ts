import {type OxlintConfig} from 'oxlint';

export interface ImportConfigOptions {
    strict?: boolean;
}

export function createImportConfig(options: ImportConfigOptions = {}): OxlintConfig {
    const {strict = false} = options;

    return {
        plugins: ['import'],
        rules: {
            'import/consistent-type-specifier-style': 'off',
            'import/default': 'error',
            'import/export': 'off',
            'import/exports-last': 'off',
            'import/extensions': 'off',
            'import/first': 'error',
            'import/group-exports': 'off',
            'import/max-dependencies': 'off',
            'import/named': 'error',
            'import/namespace': 'off',
            'import/no-absolute-path': 'error',
            'import/no-amd': strict ? 'error' : 'warn',
            'import/no-anonymous-default-export': strict
                ? [
                    'warn',
                    {
                        allowArray: true,
                        allowArrowFunction: true,
                        allowAnonymousClass: false,
                        allowAnonymousFunction: false,
                        allowCallExpression: true,
                        allowLiteral: true,
                        allowObject: true,
                    },
                ]
                : 'off',
            'import/no-commonjs': strict ? 'error' : 'warn',
            'import/no-cycle': strict ? 'warn' : 'off',
            'import/no-default-export': 'off',
            'import/no-duplicates': 'error',
            'import/no-dynamic-require': 'warn',
            'import/no-empty-named-blocks': 'off',
            'import/no-mutable-exports': strict ? 'warn' : 'off',
            'import/no-named-as-default': strict ? 'warn' : 'off',
            'import/no-named-as-default-member': 'warn',
            'import/no-named-default': 'error',
            'import/no-named-export': 'off',
            'import/no-namespace': 'off',
            'import/no-nodejs-modules': 'off',
            'import/no-relative-parent-imports': 'off',
            'import/no-self-import': 'error',
            'import/no-unassigned-import': 'off',
            'import/no-webpack-loader-syntax': 'warn',
            'import/prefer-default-export': 'off',
            'import/unambiguous': 'error',
        },
    };
}
