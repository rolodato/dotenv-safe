var dotenv = require('../index.js');
var assert = require('assert');

assert.throws(function () {
  dotenv.load({sample: '.env.fail'});
  // Consider providing an Error class
}, /Missing environment variables/);
