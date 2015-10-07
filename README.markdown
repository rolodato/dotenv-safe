# dotenv-safe

Identical to [`dotenv`](https://github.com/motdotla/dotenv), but ensures that
all necessary environment variables are defined after reading from `.env`.

# Installation

```
npm install --save dotenv
```

# Usage

Requiring and loading is identical:

```js
require('dotenv-safe').load();
```

This will load environment variables from `.env` as usual, but will also read
any variables defined in `.env.sample`. If any variables are missing from
`.env`, an exception listing them will be thrown. Otherwise, returns `true`.

A different filename for `.env.sample` can be provided:

```js
require('dotenv-safe').load({sample: './.my-env-sample-filename'});
```

# Options

[Same options and methods supported by `dotenv`](https://github.com/motdotla/dotenv#options).

# Motivation

I regularly use apps that depend on `.env` files and don't validate if all
the necessary variables have been defined correctly.
Instead of having to document and validate this manually, I prefer to commit
a sample `.env` file (no values, key names only) which can be used as a
reference.
