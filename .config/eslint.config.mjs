import globals from 'globals'
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
    js.configs.recommended,
    {
        files: [ 'scripts/**/*.{js,mjs}', 'src/**/*.{js,mjs}' ],
        languageOptions: {
            /*/ ES2025 for Node 24 (LTS), ES2024 for Node 22 (LTS) and 23 /*/
            ecmaVersion: 2025,
            globals: { ...globals.node },
            sourceType: 'module',
        },
    },
    {
        files: [ 'src/opendata-api/*.js' ],
        languageOptions: {
            globals: { ...globals.node, opendata: 'readonly' },
        },
    },
    {
        files: [ 'test/unit/**/*.{js,mjs}' ],
        languageOptions: {
            // ecmaVersion: 'latest',
            globals: { ...globals.browser, ...globals.jest },
            sourceType: 'module',
        },
    },
    {
        files: [ 'www/assets/js/**/*.{js,mjs}' ],
        languageOptions: {
            // ecmaVersion: 'latest',
            globals: { ...globals.browser, editor: 'readonly', JSONTag: 'readonly', simply: 'readonly' },
            sourceType: 'module',
        },
    },
    { ignores: [ 'node_modules/**' ] },
    {
        plugins: {
            js,
        },
    },
    {
        rules: {
            'no-case-declarations': 'off', // www/assets/js/databrowser.js, www/assets/js/spreadsheet.js
            'no-debugger': 'off', // www/assets/js/api.js, www/assets/js/databrowser.js
            'no-empty': 'off', // src/api-server.js, www/assets/js/changes.mjs
            'no-extra-boolean-cast': 'off', // www/assets/js/transformers.js
            'no-undef': 'off',  // src/api-server.js, src/opendata-api.js, src/tree-query.js, test/orphans.mjs,
                // www/assets/js/api.js, www/assets/js/changes.mjs, www/assets/js/databrowser.js,
                // www/assets/js/datasources.js, www/assets/js/import.mjs, www/assets/js/local-api.js,
                // www/assets/js/sloDocument.js, www/assets/js/spreadsheet.js, www/assets/js/transformers.js
            'no-unreachable': 'off', // www/assets/js/databrowser.js
            'no-unused-vars': 'off', // src/api-server.js, src/opendata-api.js,
                // src/opendata-api/curriculum-leerdoelenkaarten.js, www/assets/js/api.js, www/assets/js/changes.mjs,
                // www/assets/js/databrowser.js, www/assets/js/datasources.js, www/assets/js/import.mjs,
                // www/assets/js/sloDocument.js, www/assets/js/spreadsheet.js, www/assets/js/transformers.js,
                // www/assets/js/vanillaSelectBox.js
            'no-useless-assignment': 'off', // www/assets/js/api.js, www/assets/js/databrowser.js,
                // www/assets/js/spreadsheet.js
        },
    },
])

/* Full list of currently undefined variables:
 *
 * anyOf, apiURL, browser, Buffer, changes, Changes, column, console, currentContext,
 * data, Diff, el, error, fetch, FileSaver, filter, from, getId, getType, hoistedChild,
 * initContexts, jsontagMeta, listener, localAPI, MathJax, meta, newValue, page,
 * parentRow, process, request, row, slo, sloDocument, spreadsheet, titles, type,
 * updateDataSource, URL, vanillaSelectBox, XLSX
 */
