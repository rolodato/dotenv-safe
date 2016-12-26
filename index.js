'use strict';

var dotenv = require('dotenv');
var fs = require('fs');
var MissingEnvVarsError = require('./MissingEnvVarsError.js');

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
            // Missing .env can be ignored if all vars are present in environment
            if (dotenvResult.error.code === 'ENOENT') {
                dotenvResult = { parsed: {} };
            } else {
                throw dotenvResult.error;
            }
        }
        var sample = options.sample || '.env.example';
        var sampleVars = dotenv.parse(fs.readFileSync(sample));
        var allowEmptyValues = options.allowEmptyValues || false;
        var processEnv = allowEmptyValues ? process.env : compact(process.env);
        var missing = difference(Object.keys(sampleVars), Object.keys(processEnv));

        if (missing.length > 0) {
            throw new MissingEnvVarsError(allowEmptyValues, options.path || '.env', sample, missing);
        }

        // Key/value pairs defined in example file and resolved from environment
        var required = Object.keys(sampleVars).reduce(function (acc, key) {
            acc[key] = process.env[key];
            return acc;
        }, {});
        return {
            parsed: dotenvResult.parsed,
            required: required
        };
    },
    parse: dotenv.parse
};

module.exports.load = module.exports.config;
module.exports.MissingEnvVarsError = MissingEnvVarsError;
