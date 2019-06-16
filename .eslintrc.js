// https://eslint.org/docs/user-guide/configuring
// File taken from https://github.com/vuejs-templates/webpack/blob/1.3.1/template/.eslintrc.js, thanks.

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    jest: true
  },
  extends: [
    "airbnb-base",
    "prettier",
    "prettier/standard",
    "plugin:vue/recommended"
  ],
  // required to lint *.vue files
  plugins: ["vue", "prettier"],
  rules: {
    "vue/html-indent": ["error", 2],
    "no-param-reassign": ["error", { props: false }],
    "space-in-parens": ["error", "always", { exceptions: ["{}"] }],
    "linebreak-style": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};
