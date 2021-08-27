module.exports = {
  env: {
    es2021: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
