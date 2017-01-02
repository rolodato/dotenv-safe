module.exports = {
  extends: 'google',
  rules: {
    'require-jsdoc': 0,
    'no-var': 0,
    'max-len': [2, {
      code: 120,
      tabWidth: 2,
      ignoreUrls: true,
      ignorePattern: '^goog\.(module|require)',
    }],
  }
};
