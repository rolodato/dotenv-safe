var chai = require('chai');
var assert = chai.assert;
var dotenv = require('../index.js');
var MissingEnvVarsError = dotenv.MissingEnvVarsError;
var fs = require('fs-extra');
var clone = require('lodash.clonedeep');

describe('dotenv-safe', function() {
  var originalEnvironment;
  var originalCWD;

  before(function(done) {
    originalCWD = process.cwd();
    process.chdir('./test');
    process.env.HELLO = 'fromTheOtherSide';
    originalEnvironment = clone(process.env);
    fs.mkdirs('envs', done);
  });

  beforeEach(function(done) {
    process.env = clone(originalEnvironment);
    fs.copy('original', 'envs', done);
  });

  afterEach(function(done) {
    fs.emptyDir('envs', done);
  });

  after(function(done) {
    fs.remove('envs', done);
    originalCWD = process.cwd(originalCWD);
  });

  it('does not throw error when all is well', function() {
    assert.isOk(dotenv.load({
      sample: 'envs/.env.success',
      path: 'envs/.env',
    }));
  });

  it('does not throw error when variable exists but is empty and allowEmptyValues option is true', function() {
    assert.isOk(dotenv.load({
      sample: 'envs/.env.allowEmpty',
      path: 'envs/.env',
      allowEmptyValues: true,
    }));
  });

  it('does not throw error when .env is missing but variables exist', function() {
    process.env.HELLO = 'WORLD';

    assert.isOk(dotenv.load({
      sample: 'envs/.env.noDotEnv',
    }));
  });

  it('throws error when a variable is missing', function() {
    assert.throws(
      function() {
        dotenv.load({
          sample: 'envs/.env.fail',
          path: 'envs/.env',
        });
      },
      MissingEnvVarsError
    );
  });

  it('throws error when a variable exists but is empty and allowEmptyValues option is false', function() {
    assert.throws(
      function() {
        dotenv.load({
          sample: 'envs/.env.allowEmpty',
          path: 'envs/.env',
          allowEmptyValues: false,
        });
      },
      MissingEnvVarsError
    );
  });

  it('throws error when a variable does not exist and allowEmptyValues option is true', function() {
    assert.throws(
      function() {
        dotenv.load({
          sample: 'envs/.env.fail',
          path: 'envs/.env',
          allowEmptyValues: true,
        });
      },
      MissingEnvVarsError
    );
  });

  it('returns an object with parsed .env', function() {
    var result = dotenv.load({
      sample: 'envs/.env.allowEmpty',
      path: 'envs/.env',
      allowEmptyValues: true,
    });
    assert.deepEqual(
      {
        parsed: {HELLO: 'world', EMPTY: ''},
        required: {EMPTY: ''},
      },
      result
    );
  });

  it('returns an object with values from process.env in case when .env does not exist', function() {
    var result = dotenv.load({
      sample: 'envs/.env.noDotEnv',
    });
    assert.deepEqual({}, result.parsed);
    assert.deepEqual({HELLO: 'fromTheOtherSide'}, result.required);
    assert.equal('ENOENT', result.error.code);
  });

  it('does not overwrite externally set environment variables', function() {
    var result = dotenv.load({
      sample: 'envs/.env.success',
      path: 'envs/.env',
    });
    assert.equal(process.env.HELLO, 'fromTheOtherSide');
    assert.deepEqual({
      parsed: {HELLO: 'world', EMPTY: ''},
      required: {HELLO: 'fromTheOtherSide'},
    }, result);
  });
});
