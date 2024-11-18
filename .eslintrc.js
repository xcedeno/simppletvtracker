// eslint.js
// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-restricted-globals": ["off"],
  },
  env: {
    browser: true,
    node: true,
  },
};
