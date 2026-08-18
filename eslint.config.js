import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            'app/graphql/generated/**',
            'node_modules/**',
            'build/**',
            'dist/**',
            'playwright-report/**',
            'test-results/**',
            'coverage/**',
            '.react-router/**',
            '**/*.config.{js,cjs,ts,cts}',
        ],
    },
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'jsx-a11y': jsxA11y,
        },
        settings: {
            react: { version: 'detect' },
            formComponents: ['Form'],
            linkComponents: [
                { name: 'Link', linkAttribute: 'to' },
                { name: 'NavLink', linkAttribute: 'to' },
            ],
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            ...react.configs.flat['jsx-runtime'].rules,
            ...reactHooks.configs['recommended-latest'].rules,
            ...jsxA11y.flatConfigs.recommended.rules,
            'no-mixed-spaces-and-tabs': 'off',
            'react/no-unescaped-entities': 'off',
            'jsx-a11y/click-events-have-key-events': 'warn',
            'jsx-a11y/no-static-element-interactions': 'warn',
        },
    },
    ...tseslint.configs.recommended,
    {
        // Playwright's fixture callback is named `use(...)`, which the
        // react-hooks plugin (post-React 19) flags as an illegal hook call.
        files: ['tests/e2e/**/*.{ts,tsx}', 'tests/helpers/fixtures.ts'],
        rules: {
            'react-hooks/rules-of-hooks': 'off',
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            import: importPlugin,
        },
        settings: {
            'import/internal-regex': '^~/',
            'import/resolver': {
                node: { extensions: ['.ts', '.tsx'] },
                typescript: { alwaysTryTypes: true },
            },
        },
        rules: {
            ...importPlugin.flatConfigs.recommended.rules,
            ...importPlugin.flatConfigs.typescript.rules,
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            'react-hooks/exhaustive-deps': 'warn',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/order': 'off',
        },
    },
)
