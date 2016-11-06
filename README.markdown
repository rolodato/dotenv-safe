# dotenv-safe

Identical to [`dotenv`](https://github.com/motdotla/dotenv), but ensures that all necessary environment variables are defined after reading from `.env`.
These needed variables are read from `.env.example`, which should be commited along with your project.

# Installation

```
npm install --save dotenv-safe
```

# Example

```dosini
# .env.example, commited to repo
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

This will load environment variables from `.env` as usual, but will also read any variables defined in `.env.example`.
If any variables are missing from the environment, an exception listing them will be thrown.
Otherwise, returns `true`.

`dotenv-safe` compares the actual environment after loading `.env` (if any)  with the example file, so it will work correctly if environment variables are missing in `.env` but provided through other means such as a shell script.

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

# Motivation

I regularly use apps that depend on `.env` files but don't validate if all the necessary variables have been defined correctly.
Instead of having to document and validate this manually, I prefer to commit a self-documenting `.env` file (no values, key names only) which can be used as a reference.
