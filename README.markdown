# dotenv-safe [![Build Status](https://github.com/rolodato/dotenv-safe/actions/workflows/node.js.yml/badge.svg)](https://github.com/rolodato/dotenv-safe/actions/workflows/node.js.yml)

Identical to [`dotenv`](https://github.com/motdotla/dotenv), but ensures that all needed environment variables are defined after reading from `.env`.
The names of the needed variables are read from `.env.example`, which should be commited along with your project.

`dotenv-safe` only checks if all the needed variable names exist in `process.env` after initialising. It does not assume anything about the presence, format or validity of the values.

# Installation

```
npm install dotenv-safe
```

```
pnpm install dotenv-safe
```

```
yarn add dotenv-safe
```

# Example

```dosini
# .env.example, committed to repo
SECRET=
TOKEN=
KEY=
```

```dosini
# .env, private
SECRET=topsecret
TOKEN=
```

```js
// index.js
require('dotenv-safe').config();
```

Or, if you are using [ES modules](https://nodejs.org/api/esm.html):

```js
// index.mjs
import { config } from 'dotenv-safe';
config();
```

Since the provided `.env` file does not contain all the variables defined in
`.env.example`, an exception is thrown:

```
MissingEnvVarsError: The following variables were defined in .env.example but are not present in the environment:
  TOKEN, KEY
Make sure to add them to .env or directly to the environment.

If you expect any of these variables to be empty, you can use the allowEmptyValues option:
require('dotenv-safe').config({
  allowEmptyValues: true
});
```

Not all the variables have to be defined in `.env`; they can be supplied externally.
For example, the following would work:

```
$ TOKEN=abc KEY=xyz node index.js
```

# Usage

Requiring and loading is identical:

```js
require('dotenv-safe').config();
```

This will load environment variables from `.env` as usual, but will also read any variables defined in `.env.example`.
If any variables are already defined in the environment before reading from `.env`, they will not be overwritten.
If any variables are missing from the environment, a [`MissingEnvVarsError`](MissingEnvVarsError.js) will be thrown, which lists the missing variables.
Otherwise, returns an object with the following format:

```js
{
  parsed: { SECRET: 'topsecret', TOKEN: '' },          // parsed representation of .env
  required: { SECRET: 'topsecret', TOKEN: 'external' } /* key-value pairs required by .env.example
                                                          and defined by environment */
}
```

If all the required variables were successfully read but an error was thrown when trying to read the `.env` file, the error will be included in the result object under the `error` key.

`dotenv-safe` compares the actual environment after loading `.env` (if any) with the example file, so it will work correctly if environment variables are missing in `.env` but provided through other means such as a shell script.

## Preloading

You can use the `--require` (`-r`) command line option to preload dotenv-safe.
By doing this, you do not need to require and load dotenv in your application code.
This is the preferred approach when using import instead of require.

```
$ node -r dotenv-safe/config your_script.js
```

[See the dotenv README for more information](https://github.com/motdotla/dotenv#preload).

## Continuous integration (CI)

It can be useful to depend on a different set of example variables when running in a CI environment.
This can be done by checking if the `CI` environment variable is defined, which is supported by virtually all CI solutions.
For example:

```js
require('dotenv-safe').config({
  example: process.env.CI ? '.env.ci.example' : '.env.example'
});
```

# Options

[Same options and methods supported by `dotenv`](https://github.com/motdotla/dotenv#options), in addition to the options below:

```js
require('dotenv-safe').config({
    allowEmptyValues: true,
    example: './.my-env-example-filename'
});
```

Starting from version 9.0.0, `dotenv` is a peer dependency of `dotenv-safe`. This means that the actual version of `dotenv` used defaults to the latest available at install time, or whatever is specified by your application.

## `allowEmptyValues`

If a variable is defined in the example file and has an empty value in the environment, enabling this option will not throw an error after loading.
Defaults to `false`.

## `example`

Path to example environment file.
Defaults to `.env.example`.

# Motivation

I regularly use apps that depend on `.env` files but don't validate if all the necessary variables have been defined correctly.
Instead of having to document and validate this manually, I prefer to commit a self-documenting `.env.example` file that may have placeholder or example values filled in. This can be used as a template or starting point for an actual `.env` file.
