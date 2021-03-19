'use strict';

const dotenv = require('dotenv');
const fs = require('fs');
const MissingEnvVarsError = require('./MissingEnvVarsError.js');

/**
 * @param {string[]} arrA
 * @param {string[]} arrB
 */
function difference (arrA, arrB) {
    return arrA.filter(a => arrB.indexOf(a) < 0);
}

/**
 * @param {Set<string>} optionalValues
 * @param {Set<string>} requiredValues
 */
function checkOptionalValuesAreNotRequiredToo (optionalValues, requiredValues) {
    const commonValues = [];
    optionalValues.forEach((optional) => requiredValues.has(optional) && commonValues.push(optional));
    if (commonValues.length > 0)
        throw new Error(`Values cannot be in optionalValues and requiredValues at the same time.
Values in both options: ${commonValues.join(', ')}`);
}

/**
 * @param {Record<string, string>} obj
 * @param {{ allowEmptyValues: boolean; optionalValues: Set<string>; requiredValues: Set<string> }} config
 * @returns {Record<string, string>}
 */
function selectValues (obj, config) {
    function allowIfCanBeEmpty (key) {
        return (
            (config.allowEmptyValues === true && !config.requiredValues.has(key))
            || config.optionalValues.has(key)
        );
    }

    const result = {};
    Object.keys(obj).forEach(key => {
        if (obj[key] || allowIfCanBeEmpty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
}

module.exports = {
    config: function(options = {}) {
        const dotenvResult = dotenv.config(options);
        const example = options.example || options.sample || '.env.example';

        const allowEmptyValues = options.allowEmptyValues || false;
        const optionalValues = options.optionalValues || new Set();
        const requiredValues = options.requiredValues || new Set();

        if (!(requiredValues instanceof Set) || !(optionalValues instanceof Set))
            throw new Error('Options requiredValues and optionalValues must be a Set.');

        if (!allowEmptyValues && requiredValues.size > 0)
            throw new Error('Option requiredValues is useless if allowEmptyValues option is false. All values are required by default.');

        checkOptionalValuesAreNotRequiredToo(requiredValues, optionalValues);

        const processEnv = selectValues(process.env, {
            allowEmptyValues,
            optionalValues,
            requiredValues
        });

        const exampleVars = dotenv.parse(fs.readFileSync(example));
        const missing = difference(Object.keys(exampleVars), Object.keys(processEnv));

        if (missing.length > 0) {
            throw new MissingEnvVarsError(allowEmptyValues, options.path || '.env', example, missing, dotenvResult.error);
        }

        // Key/value pairs defined in example file and resolved from environment
        const required = Object.keys(exampleVars).reduce((acc, key) => {
            acc[key] = process.env[key];
            return acc;
        }, {});
        const error = dotenvResult.error ? { error: dotenvResult.error } : {};
        const result = {
            parsed: dotenvResult.error ? {} : dotenvResult.parsed,
            required: required
        };
        return Object.assign(result, error);
    },
    parse: dotenv.parse,
    MissingEnvVarsError: MissingEnvVarsError
};

module.exports.MissingEnvVarsError = MissingEnvVarsError;
