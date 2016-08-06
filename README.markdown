# dotenv-safe

A library that augments [`dotenv`](https://github.com/motdotla/dotenv) to ensure that
all necessary environment variables are defined after reading from `.env`.
These needed variables are read from `.env.example`, which should be commited
along with your project.

# Installation

```
npm install --save dotenv-safe
```

# Example

```dosini
# .env, private
SECRET=topsecret
```

```dosini
# .env.example, commited to repo
SECRET=
TOKEN=
KEY=
```

```js
require('dotenv-safe').load();
```

Since the provided `.env` file does not contain all the variables defined in
`.env.example`, an exception is thrown:

```
Error: Missing environment variables: TOKEN, KEY
```

# Usage

Requiring and loading is identical:

```js
require('dotenv-safe').load();
```

This will load environment variables from `.env` as usual, but will also read
any variables defined in `.env.example`. If any variables are missing from
`.env`, an exception listing them will be thrown. Otherwise, returns `true`.

`dotenv-safe` compares the actual environment after loading `.env` with the
example file, so it will work correctly if environment variables are missing
in the `.env` but provided through other means such as a shell script.

You can use `.env.example` or provide a different filename:

```js
require('dotenv-safe').load({sample: './.my-env-sample-filename'});
```

# Options

[Same options and methods supported by `dotenv`](https://github.com/motdotla/dotenv#options).

An extra option has been added to ignore exception throwing when a variable exists in the `.env` file but is empty: `allowEmptyValues`.

```js
require('dotenv-safe').load({
    sample: __dirname + '/.my-env-sample-filename',
    allowEmptyValues: true
});
```

# Motivation

I regularly use apps that depend on `.env` files but don't validate if all
the necessary variables have been defined correctly.
Instead of having to document and validate this manually, I prefer to commit
a sample `.env` file (no values, key names only) which can be used as a
reference.
