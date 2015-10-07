var dotenv = require('../index.js');
var assert = require('assert');

assert(dotenv.load({sample: '.env.success'}));
