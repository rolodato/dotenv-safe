module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "node": true,
    "mocha": true
  },
  "rules": {
    "no-trailing-spaces": "error",
    "semi": "error",
    "indent": ["error", 4],
    "comma-dangle": ["error", "never"]
  },
  "parserOptions": {
    "ecmaVersion": 6
  }
};
