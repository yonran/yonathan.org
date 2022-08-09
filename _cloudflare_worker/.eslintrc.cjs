/* eslint-disable no-undef */
module.exports = {
    extends: ['eslint:recommended'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
    overrides: [
        {
            files: ['*.cjs', '*.mjs'],
        },
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: ['./tsconfig.json'],
            },
            extends: [
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
        },
    ],
    root: true,
    ignorePatterns: ['!.prettierrc.cjs'],
};
