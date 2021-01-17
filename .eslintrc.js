module.exports = {
   parser: "@typescript-eslint/parser",
   env: {
      node: true,
      commonjs: true,
      // Implicitly enables {parserOptions:{ecmaVersion: 6}}
      es6: true,
   },
   parserOptions: {
      ecmaFeatures: {
         jsx: true,
         // Enables global strict mode:
         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
         impliedStrict: true,
      },
      // For using imports
      sourceType: "module",
   },
   extends: [
      // Uses the recommended rules for TypeScript
      "plugin:@typescript-eslint/recommended",

      // Uses the recommended rules for React
      "plugin:react/recommended",

      // Turn off styling rules handled by Prettier
      // MUST BE LISTED LAST in order to override successfully
      "prettier/@typescript-eslint",
   ],
   overrides: [
      {
         files: ["*.spec.ts*"],
         rules: {
            "@typescript-eslint/no-empty-function": "off",
         },
      },
   ],
};
