import type {OxlintConfig} from 'oxlint';

export interface ReactConfigOptions {
    strict?: boolean;
}

export function createReactConfig(options: ReactConfigOptions = {}): OxlintConfig {
    const {strict = false} = options;

    return {
        plugins: ['react'],
        rules: {
            'react/button-has-type': 'off',
            'react/checked-requires-onchange-or-readonly': 'off',
            'react/display-name': 'off',
            'react/exhaustive-deps': 'error',
            'react/forbid-dom-props': 'off',
            'react/forbid-elements': 'off',
            'react/forward-ref-uses-ref': 'off',
            'react/iframe-missing-sandbox': 'off',
            'react/jsx-boolean-value': ['error', 'never'],
            'react/jsx-curly-brace-presence': [
                'error',
                {
                    props: 'never',
                    children: 'never',
                    propElementValues: 'always',
                },
            ],
            'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx', '.es', '.tsx']}],
            'react/jsx-fragments': ['error', 'syntax'],
            'react/jsx-handler-names': 'off',
            'react/jsx-key': 'error',
            'react/jsx-max-depth': 'off',
            'react/jsx-no-comment-textnodes': 'warn',
            'react/jsx-no-constructed-context-values': strict ? 'warn' : 'off',
            'react/jsx-no-duplicate-props': 'error',
            'react/jsx-no-script-url': 'warn',
            'react/jsx-no-target-blank': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-no-useless-fragment': strict ? 'error' : 'warn',
            'react/jsx-pascal-case': ['error', {allowAllCaps: true}],
            'react/jsx-props-no-spread-multi': 'error',
            'react/jsx-props-no-spreading': 'off',
            'react/no-array-index-key': 'error',
            'react/no-children-prop': 'error',
            'react/no-clone-element': 'off',
            'react/no-danger': 'warn',
            'react/no-danger-with-children': 'error',
            'react/no-did-mount-set-state': 'off',
            'react/no-direct-mutation-state': 'off',
            'react/no-find-dom-node': 'off',
            'react/no-is-mounted': 'off',
            'react/no-multi-comp': 'off',
            'react/no-namespace': 'off',
            'react/no-react-children': 'off',
            'react/no-redundant-should-component-update': 'off',
            'react/no-render-return-value': 'error',
            'react/no-set-state': 'off',
            'react/no-string-refs': 'off',
            'react/no-this-in-sfc': 'off',
            'react/no-unescaped-entities': 'error',
            'react/no-unknown-property': 'error',
            'react/no-unsafe': 'off',
            'react/no-will-update-set-state': 'off',
            'react/only-export-components': 'off',
            'react/prefer-es6-class': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/require-render-return': 'off',
            'react/rules-of-hooks': 'error',
            'react/self-closing-comp': ['error', {component: true, html: false}],
            'react/state-in-constructor': 'off',
            'react/style-prop-object': 'error',
            'react/void-dom-elements-no-children': 'error',
        },
    };
}
