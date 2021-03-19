'use strict';

const chai = require('chai');
const assert = chai.assert;
const dotenv = require('../index.js');
const MissingEnvVarsError = dotenv.MissingEnvVarsError;
const fs = require('fs-extra');
const clone = require('lodash.clonedeep');

describe('dotenv-safe', () => {
    let originalEnvironment;
    let originalCWD;

    before(done => {
        originalCWD = process.cwd();
        process.chdir('./test');
        assert.equal(process.env.HELLO, 'fromTheOtherSide');
        originalEnvironment = clone(process.env);
        fs.mkdirs('envs', done);
    });

    beforeEach(done => {
        process.env = clone(originalEnvironment);
        fs.copy('original', 'envs', done);
    });

    afterEach(done => {
        fs.emptyDir('envs', done);
    });

    after(done => {
        fs.remove('envs', done);
        originalCWD = process.cwd(originalCWD);
    });

    it('does not throw error when all is well', () => {
        assert.isOk(dotenv.config({
            example: 'envs/.env.success',
            path: 'envs/.env'
        }));
    });

    it('does not throw error when variable exists but is empty and allowEmptyValues option is true', () => {
        assert.isOk(dotenv.config({
            example: 'envs/.env.allowEmpty',
            path: 'envs/.env',
            allowEmptyValues: true
        }));
    });

    it('does not throw error when a variable exists but is empty and optionalValues option allows it', () => {
        assert.isOk(dotenv.config({
            example: 'envs/.env.allowEmpty',
            path: 'envs/.env',
            optionalValues: new Set(['EMPTY'])
        }));
    });

    it('does not throw error when .env is missing but variables exist', () => {
        process.env.HELLO = 'WORLD';

        assert.isOk(dotenv.config({
            example: 'envs/.env.noDotEnv'
        }));
    });

    it('throws error when a variable is missing', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.fail',
                path: 'envs/.env'
            });
        }, MissingEnvVarsError);
    });

    it('throws error when a variable does not exist and allowEmptyValues option is true', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.fail',
                path: 'envs/.env',
                allowEmptyValues: true
            });
        }, MissingEnvVarsError);
    });

    it('throws error when a variable exists but is empty and allowEmptyValues option is false', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.allowEmpty',
                path: 'envs/.env',
                allowEmptyValues: false
            });
        }, MissingEnvVarsError);
    });

    it('throws error when a variable exists but is empty and allowEmptyValues option is true but is in requiredValues', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.allowEmpty',
                path: 'envs/.env',
                allowEmptyValues: true,
                requiredValues: new Set(['EMPTY'])
            });
        }, MissingEnvVarsError);
    });

    it('throws error when a variable does not exist and optionalValues option does not allows it', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.allowEmpty',
                path: 'envs/.env',
                optionalValues: new Set()
            });
        }, MissingEnvVarsError);
    });

    it('throws error when optionalValues option is not a Set', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.success',
                path: 'envs/.env',
                optionalValues: ['HELLO']
            });
        }, Error);
    });

    it('throws error when requiredValues option is not a Set', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.success',
                path: 'envs/.env',
                requiredValues: ['HELLO']
            });
        }, Error);
    });

    it('throws error when allowEmptyValues option it false and requiredValues option is not empty (all values are required by default)', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.success',
                path: 'envs/.env',
                allowEmptyValues: false,
                requiredValues: new Set(['HELLO'])
            });
        }, Error);
    });

    it('throws error when allowEmptyValues option it true and optionalValues option is not empty (all values are optional when allowEmptyValues is true)', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.success',
                path: 'envs/.env',
                allowEmptyValues: true,
                optionalValues: new Set(['HELLO'])
            });
        }, Error);
    });

    it('returns an object with parsed .env', () => {
        const result = dotenv.config({
            example: 'envs/.env.allowEmpty',
            path: 'envs/.env',
            allowEmptyValues: true
        });
        assert.deepEqual({
            parsed: { HELLO: 'world', EMPTY: '' },
            required: { EMPTY: '' }
        }, result);
    });

    it('returns an object with values from process.env in case when .env does not exist', () => {
        const result = dotenv.config({
            example: 'envs/.env.noDotEnv'
        });
        assert.deepEqual({}, result.parsed);
        assert.deepEqual({ HELLO: 'fromTheOtherSide' }, result.required);
        assert.equal('ENOENT', result.error.code);
    });

    it('does not overwrite externally set environment variables', () => {
        const result = dotenv.config({
            example: 'envs/.env.success',
            path: 'envs/.env'
        });
        assert.equal(process.env.HELLO, 'fromTheOtherSide');
        assert.deepEqual({
            parsed: { HELLO: 'world', EMPTY: '' },
            required: { HELLO: 'fromTheOtherSide' }
        }, result);
    });

    it('has stack traces that list which variables are missing', () => {
        try {
            throw new MissingEnvVarsError(false, '.env', '.env.example', ['FOO', 'BAR'], null);
        } catch (e) {
            assert.include(e.stack, 'FOO');
            assert.include(e.stack, 'BAR');
        }
    });
});
