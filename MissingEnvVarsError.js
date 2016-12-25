'use strict';

var util = require('util');

function MissingEnvVarsError (allowEmptyValues, dotenvFilename, sampleFilename, missingVars) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.missing = missingVars;
    this.sample = sampleFilename;
    var emptyValuesMessage = 'If you expect any of these missing variables to be empty, you can use the allowEmptyValues option: \n\n' +
        "require('dotenv-safe').load({\n" +
        '  allowEmptyValues: true\n' +
        '});';
    this.message = 'The folowing variables are defined in ' + sampleFilename + ' but are not defined in the environment: ' + missingVars.join(', ') + '.\n' +
        'Make sure to add them to ' + dotenvFilename + ' or directly to the environment.';
    if (!allowEmptyValues) {
        this.message += '\n' + emptyValuesMessage;
    }
}

util.inherits(MissingEnvVarsError, Error);
module.exports = MissingEnvVarsError;
