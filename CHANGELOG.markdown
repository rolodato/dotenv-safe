# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [9.1.0] - 2024-02-26
### Added
- Options specific to `dotenv-safe` (`example` and `allowEmptyValues`) can now be set with the `DOTENV_CONFIG_EXAMPLE` and `DOTENV_CONFIG_ALLOW_EMPTY_VALUES` environment variables when preloading.

## [9.0.0] - 2024-02-06
### Changed
- *Breaking*: `dotenv` is now a [peer dependency](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies) of `dotenv-safe`. If you already use a previous `dotenv-safe` version in your application, your `package-lock.json` will already reference a specific `dotenv` version and no action is required. Otherwise, running `npm install dotenv-safe` will automatically install the latest `dotenv` version, which may have [breaking changes](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies). You can run `npm list dotenv` to confirm which `dotenv` version is being used by your application.

## [8.2.1] - 2019-10-16
### Fixed
- Add missing package-lock.json.

## [8.2.0] - 2019-10-15
### Changed
- Upgraded `dotenv` dependency to version 8.2.0. See [dotenv's CHANGELOG](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md#820-2019-10-16) for more details.

## [8.1.0] - 2019-08-20
### Changed
- Upgraded `dotenv` dependency to version 8.1.0. See [dotenv's CHANGELOG](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md#810-2019-08-18) for more details

## [6.1.0] - 2018-10-09
### Changed
- Upgraded `dotenv` dependency to version 6.1.0. See [dotenv's CHANGELOG](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md#610---2018-10-08) for more details

## [6.0.0] - 2018-06-07
### Changed
- Upgraded `dotenv` dependency to version 6.0.0. See [dotenv's CHANGELOG](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md#600---2018-06-02) for more details

## [5.0.1] - 2018-02-20
### Fixed
- Restored config.js file for preloading

## [5.0.0] - 2018-02-19
### Added
- `example` option as an alias of `sample`
- Testing against Node v8 and v9

### Changed
- *Breaking*: Updated to dotenv 5.0.0. See [dotenv's CHANGELOG](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md#500---2018-01-29) for more details
- Slightly reworded error messages
- Updated code to use ES6 syntax features

### Removed
- Testing against Node v7

## [4.0.4] - 2017-04-28
### Fixed
- Fix installation instructions for yarn. Released only to update README on npmjs.com.

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
