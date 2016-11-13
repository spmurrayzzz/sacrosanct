# sacrosanct

[![Build Status](https://travis-ci.org/spmurrayzzz/sacrosanct.png?branch=master)](https://travis-ci.org/spmurrayzzz/sacrosanct)

Module for creating immutable JavaScript objects using ES2015 Proxies.

*Requires Node.js 6+*

## Why?

The purpose of this module is to protect shared objects from being mutated
as you pass them around without freezing the original objects. Great example of
this would be for use in a redux-like application where application state should
only be mutated by dispatching actions that ultimately return brand new states.

## Wait, why not just use `Object.freeze()`?

You could! `Object.freeze()` would be appropriate for the use case that you
had an object you wanted to freeze forever and never touch again. But what if
you had an object that you wanted to be able to safely share with others, but
also retain the ability to make runtime changes yourself? This is where using
`Proxy` comes into play. The original object passed into `sacrosanct()` remains
mutable, thus allowing you to make whatever changes you'd like to the target
object in your own module scope, while restricting access for others by
exporting the returned frozen object.

## Installation

```bash
npm install sacrosanct
```

## Usage

```js
const freeze      = require('sacrosanct');
const frozen      = freeze({ cantChangeMe: true });

frozen.cantChangeMe = false;

console.log( frozen.cantChangeMe ); // true
```

You can configure frozen objects to be noisy and throw on mutations as well.
Just pass `true` as the second argument to turn on strict mode (for use in
conjunction with `use strict`).

```js
'use strict';

const freeze      = require('sacrosanct');
const frozen      = freeze( { cantChangeMe: true }, true );

frozen.cantChangeMe = false; // TypeError: 'set' on proxy: trap returned falsish for property 'cantChangeMe'
```
