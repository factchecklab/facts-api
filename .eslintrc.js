module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: 'babel-eslint',
  parserOptions: {
  },
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'camelcase': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-unused-vars': 'warn',
  }
}
