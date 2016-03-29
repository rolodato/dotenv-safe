var chai = require('chai');
var assert = chai.assert;
var dotenv = require('../index.js');

describe('dotenv-safe', function () {
    it('does not throw error when all is well', function () {
        assert.isOk(dotenv.load({
            sample: '.env.success'
        }));
    });

    it('does not throw error when variable exists but is empty and allowEmptyValues option is true', function () {
        assert.isOk(dotenv.load({
            sample: '.env.allowEmpty',
            allowEmptyValues: true
        }));
    });

    it('throws error when a variable is missing', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.fail'
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });

    it('throws error when a variable exists but is empty and allowEmptyValues option is false', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.allowEmpty',
                    allowEmptyValues: false
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });

    it('throws error when a variable does not exist and allowEmptyValues option is true', function () {
        assert.throws(
            function () {
                dotenv.load({
                    sample: '.env.fail',
                    allowEmptyValues: true
                });
                // Consider providing an Error class
            },
            /Missing environment variables/
        );
    });
});
