'use strict';

var dotenv = require('dotenv');
var fs = require('fs');
var util = require('util');
function MissingEnvVarsError (allowEmptyValues, dotenvFilename, sampleFilename, missingVars, error) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.missing = missingVars;
  this.sample = sampleFilename;
  this.message = 'The folowing variables are defined in ' + sampleFilename + ' but are not defined in the environment: ' + missingVars.join(', ') + '.\n' +
    'Make sure to add them to ' + dotenvFilename + ' or directly to the environment.';
  if (!allowEmptyValues) {
    var emptyValuesMessage = 'If you expect any of these missing variables to be empty, you can use the allowEmptyValues option: \n\n' +
      "require('dotenv-safe').load({\n" +
      '  allowEmptyValues: true\n' +
      '});';
    this.message += '\n' + emptyValuesMessage;
  }
  if (error) {
    var errorMessage = 'Also, the following error was thrown when trying to read variables from ' + dotenvFilename + ': ' + error.message;
    this.message += '\n' + errorMessage;
  }
}
util.inherits(MissingEnvVarsError, Error);

function difference (arrA, arrB) {
    return arrA.filter(function (a) {
        return arrB.indexOf(a) < 0;
    });
}

function compact (obj) {
    var result = {};
    Object.keys(obj).forEach(function (key) {
        if (obj[key]) {
            result[key] = obj[key];
        }
    });
    return result;
}

module.exports = {
    config: function (options) {
        options = options || {};
        var dotenvResult = dotenv.load(options);
        if (dotenvResult.error) {
            dotenvResult.parsed = {};
        }
        var sample = options.sample || '.env.example';
        var sampleVars = dotenv.parse(fs.readFileSync(sample));
        var allowEmptyValues = options.allowEmptyValues || false;
        var processEnv = allowEmptyValues ? process.env : compact(process.env);
        var missing = difference(Object.keys(sampleVars), Object.keys(processEnv));

        if (missing.length > 0) {
            throw new MissingEnvVarsError(allowEmptyValues, options.path || '.env', sample, missing, dotenvResult.error);
        }

        // Key/value pairs defined in example file and resolved from environment
        var required = Object.keys(sampleVars).reduce(function (acc, key) {
            acc[key] = process.env[key];
            return acc;
        }, {});
        var result = {
            parsed: dotenvResult.parsed,
            required: required
        };
        if (dotenvResult.error) {
            result.error = dotenvResult.error;
        }
        return result;
    },
    parse: dotenv.parse
};

module.exports.load = module.exports.config;
module.exports.MissingEnvVarsError = MissingEnvVarsError;
