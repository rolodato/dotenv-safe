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

    it('throws error when a variable exists but is empty and allowEmptyValues option is false', () => {
        assert.throws(() => {
            dotenv.config({
                example: 'envs/.env.allowEmpty',
                path: 'envs/.env',
                allowEmptyValues: false
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
