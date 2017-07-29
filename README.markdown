# dotenv-safe

Identical to [`dotenv`](https://github.com/motdotla/dotenv), but ensures that all necessary environment variables are defined after reading from `.env`.
These needed variables are read from `.env.example`, which should be commited along with your project.

[![Build Status](https://travis-ci.org/rolodato/dotenv-safe.svg)](https://travis-ci.org/rolodato/dotenv-safe)

# Installation

```
npm install --save dotenv-safe
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
require('dotenv-safe').load();
```

Since the provided `.env` file does not contain all the variables defined in
`.env.example`, an exception is thrown:

```
MissingEnvVarsError: The following variables are defined in .env.example but are not defined in the environment: TOKEN, KEY.
Make sure to add them to .env or directly to the environment.
If you expect any of these missing variables to be empty, you can use the allowEmptyValues option:

require('dotenv-safe').load({
  allowEmptyValues: true
});
```

Not all the variables have to be defined in `.env`, they can be supplied externally.
For example, the following would work:

```
$ TOKEN=abc KEY=xyz node index.js
```

# Usage

Requiring and loading is identical:

```js
require('dotenv-safe').load();
```

This will load environment variables from `.env` as usual, but will also read any variables defined in `.env.example`.
If any variables are already defined in the environment before reading from `.env`, they will not be overwritten.
If any variables are missing from the environment, a [`MissingEnvVarsError`](MissingEnvVarsError.js) will be thrown, which lists the missing variables.
Otherwise, returns an object with the following format:

```js
{
  parsed: { SECRET: 'topsecret', TOKEN: '' },          // parsed representation of .env
  required: { SECRET: 'topsecret', TOKEN: 'external' } // key/value pairs required by .env.example
                                                       // and defined by environment
}
```

If all the required variables were successfully read but an error was thrown when trying to read the `.env` file, the error will be included in the result object under the `error` key.

`dotenv-safe` compares the actual environment after loading `.env` (if any) with the example file, so it will work correctly if environment variables are missing in `.env` but provided through other means such as a shell script.

# Options

[Same options and methods supported by `dotenv`](https://github.com/motdotla/dotenv#options).

```js
require('dotenv-safe').load({
    allowEmptyValues: true,
    sample: './.my-env-sample-filename'
});
```

## `allowEmptyValues`

If a variable is defined in the example file and has an empty value in the environment, enabling this option will not throw an error after loading.
Defaults to `false`.

## `sample`

Path to example environment file.
Defaults to `.env.example`.

# Ports

The following are ports for other languages

* PHP - https://github.com/morrislaptop/phpdotenv-safe
* Ruby - https://github.com/wework/dotenv-rails-safe

# Motivation

I regularly use apps that depend on `.env` files but don't validate if all the necessary variables have been defined correctly.
Instead of having to document and validate this manually, I prefer to commit a self-documenting `.env` file (no values, key names only) which can be used as a reference.
