# sacrosanct

Module for creating immutable JavaScript objects using ES2015 Proxies.

*Requires Node.js 6+*

## Why

The purpose of this module is to protect shared objects from being mutated
as you pass them around. Great example of this would be for use in a redux-like
application where application state should only be mutated by dispatching
actions.

## Usage

```js
const sacrosanct = require('sacrosanct');
const frozen = sacrosanct({ cantChangeMe: true });

frozen.cantChangeMe = false;

console.log( frozen.cantChangeMe ); // true
```

You can configure frozen objects to be noisy and throw on mutations as well.
Just pass `true` as the second argument to turn on strict mode.

```js
const sacrosanct = require('sacrosanct');
const frozen = sacrosanct( { cantChangeMe: true }, true );

frozen.cantChangeMe = false; // TypeError: 'set' on proxy: trap returned falsish for property 'cantChangeMe'
```
