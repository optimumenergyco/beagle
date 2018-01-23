module.exports = {
  extends: "optimum-energy",
  env: {
    mocha: true,
    node: true
  },
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
