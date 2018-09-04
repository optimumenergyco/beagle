module.exports = {
  extends: "optimum-energy",
  env: {
    mocha: true,
    node: true,
    jest: true
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "space-before-function-paren": "off"
  }
};
