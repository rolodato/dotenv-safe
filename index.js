'use strict';

var dotenv = require('dotenv');
var fs = require('fs');

function difference(arrA, arrB) {
  return arrA.filter(function(a) {
    return arrB.indexOf(a) < 0;
  });
}

module.exports = {
  config: function(options) {
    options = options || {};
    dotenv.load(options);
    var sampleVars = dotenv.parse(fs.readFileSync(options.sample || '.env.example' || '.env.sample'));
    var missing = difference(Object.keys(sampleVars), Object.keys(process.env));
    if (missing.length > 0) {
      throw new Error('Missing environment variables: ' + missing.join(', '));
    }
    return true;
  },
  parse: dotenv.parse
};

module.exports.load = module.exports.config;

