'use strict';

var util = require('util');

function MissingEnvVarsError (allowEmptyValues, dotenvFilename, sampleFilename, missingVars, error) {
    Error.call(this);
    this.name = this.constructor.name;
    this.missing = missingVars;
    this.sample = sampleFilename;
    this.message = 'The following variables are defined in ' + sampleFilename + ' but are not defined in the environment: ' + missingVars.join(', ') + '.\n' +
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
    Error.captureStackTrace(this, this.constructor);
}

util.inherits(MissingEnvVarsError, Error);
module.exports = MissingEnvVarsError;
