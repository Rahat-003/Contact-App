import globals from "globals";
import pluginJs from "@eslint/js";

export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: globals.node,
        },
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser, // Support browser globals if needed
                ...globals.node, // Add Node.js globals
            },
        },
    },
    pluginJs.configs.recommended,
    {
        rules: {
            "no-unused-vars": "off", // Disable errors for unused variables
        },
    },
];
