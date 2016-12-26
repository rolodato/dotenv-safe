var chai = require('chai');
var assert = chai.assert;
var dotenv = require('../index.js');
var MissingEnvVarsError = dotenv.MissingEnvVarsError;
var fs = require('fs-extra');

describe('dotenv-safe', function () {
    var originalEnvironment;

    before(function (done) {
        // No need to deep copy, all values are strings
        originalEnvironment = Object.assign({}, process.env);
        fs.mkdirs('envs', done);
    });

    beforeEach(function (done) {
        fs.copy('original', 'envs', done);
    });

    afterEach(function (done) {
        process.env = originalEnvironment;
        fs.emptyDir('envs', done);
    });

    after(function (done) {
        fs.remove('envs', done);
    });

    it('does not throw error when all is well', function () {
        assert.isOk(dotenv.load({
            sample: 'envs/.env.success',
            path: 'envs/.env'
        }));
    });

    it('does not throw error when variable exists but is empty and allowEmptyValues option is true', function () {
        assert.isOk(dotenv.load({
            sample: 'envs/.env.allowEmpty',
            path: 'envs/.env',
            allowEmptyValues: true
        }));
    });

    it('does not throw error when .env is missing but variables exist', function () {
        process.env.HELLO = 'WORLD';

        assert.isOk(dotenv.load({
            sample: 'envs/.env.noDotEnv'
        }));
    });

    it('throws error when a variable is missing', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: 'envs/.env.fail',
                    path: 'envs/.env'
                });
            },
            MissingEnvVarsError
        );
    });

    it('throws error when a variable exists but is empty and allowEmptyValues option is false', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: 'envs/.env.allowEmpty',
                    path: 'envs/.env',
                    allowEmptyValues: false
                });
            },
            MissingEnvVarsError
        );
    });

    it('throws error when a variable does not exist and allowEmptyValues option is true', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: 'envs/.env.fail',
                    path: 'envs/.env',
                    allowEmptyValues: true
                });
            },
            MissingEnvVarsError
        );
    });
});
