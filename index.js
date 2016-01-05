'use strict';

var dotenv = require('dotenv');
var fs = require('fs');

function difference(arrA, arrB) {
  return arrA.filter(function(a) {
    return arrB.indexOf(a) < 0;
  });
}

function compact(obj) {
  var result = {};
  Object.keys(obj).forEach(function(key) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  });
  return result;
}

module.exports = {
  config: function(options) {
    options = options || {};
    dotenv.load(options);
    var sampleVars = dotenv.parse(fs.readFileSync(options.sample || '.env.example'));
    var missing = difference(Object.keys(sampleVars), Object.keys(compact(process.env)));
    if (missing.length > 0) {
      throw new Error('Missing environment variables: ' + missing.join(', '));
    }
    return true;
  },
  parse: dotenv.parse
};

module.exports.load = module.exports.config;

