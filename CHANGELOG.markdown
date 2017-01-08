# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.0.3] - 2017-01-08
### Changed
- Bump `dotenv` dependency

## [4.0.2] - 2017-01-03
### Fixed
- Fix missing variables not being shown in stack traces while running on Node 7

## [4.0.1] - 2017-01-02
### Fixed
- Fix missing `MissingEnvVarsError.js` error when calling `load()`

## [4.0.0] - 2017-01-02
### Changed
- `load` method returns a [result object](README.markdown#usage) instead of `true`
- Throw a dedicated [`MissingEnvVarsError`](MissingEnvVarsError.js) instead of a generic `Error` if variables are missing.

## [3.0.0] - 2016-11-06
### Changed
- Compare example file to actual environment instead of `.env`.
  This makes it easier to use `dotenv-safe` in CI environments, where variables are likely to be injected by some external mechanism.

## [2.3.3] - 2016-10-28
### Fixed
- Add `files` property to `package.json`, reduces dependency size.

## [2.3.2] - 2016-09-18
### Changed
- Bump `dotenv` dependency version.

## [2.3.1] - 2016-03-29
### Fixed
- Fix `allowEmptyValues` to throw error when variable is missing.

## [2.3.0] - 2016-03-24
### Added
- Add `allowEmptyValues` option.

## [2.2.0] - 2016-01-05
### Added
- Allow `dotenv-safe` to be preloaded.

## [2.1.1] - 2015-12-11
- Literally nothing. No idea why this release exists at all.

## [2.1.0] - 2015-12-11
### Fixed
- Ignore empty environment variables when comparing current environment to the `.env` file.

## [2.0.1] - 2016-12-11
### Changed
- Don't load `.env.sample` automatically

## [2.0.0] - 2015-11-06
### Changed
- Change `.env.example` to take priority over `.env.sample` if both exist.

## [1.0.2] - 2015-10-07
### Fixed
- Update README on npm.

## [1.0.1] - 2015-10-07
### Fixed
- Update README on npm.

## [1.0.0] - 2015-10-07
### Added
- Initial release.
