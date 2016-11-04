(function ( root, factory ) {
  /* istanbul ignore next */
  if ( typeof define === 'function' && define.amd ) {
    define( [ 'exports' ], factory );
  } else if ( typeof exports === 'object' &&
    typeof exports.nodeName !== 'string' ) {
    module.exports = factory();
  } else {
    root.sacrosanct = factory();
  }
}( this, function( exports ) {

'use strict';

/**
 * cache of bools to determine whether a given proxy has been configured
 * to throw on mutations
 */
const strictCache = new WeakMap();

/**
 * returns a new immutable proxy
 * @param  {Object} val       - target object to proxy
 * @param  {Boolean} strict   - if set to `true`, the proxy throws on mutate
 * @return {Proxy}
 */
function createImmutableProxy( val, strict = false ) {
  strictCache.set( val, strict );
  return new Proxy( val, immutableHandler );
}

/**
 * determines whether a given value is an object (which would need to
 * be frozen)
 * @param  {Mixed}  arg
 * @return {Boolean}
 */
function isObject( arg ) {
  const t = typeof arg;
  return ( t === 'object' || t === 'function' ) && arg !== null;
}

/**
 * handler function for `set` and `deleteProperty` traps
 * @param  {Object} target - the object being proxied
 * @return {Boolean}
 */
function onMutation( target ) {
  return !isStrict( target );
}

/**
 * determines whether a given object has been set to throw on mutations
 * @param  {Object}  target
 * @return {Boolean}
 */
function isStrict( target ) {
  return strictCache.get( target );
}

/**
 * Detects whether a given property needs to be handled as an invariant case
 * Reference: https://mzl.la/1Zoq0AS
 * @param  {Object}  obj   - target object
 * @param  {String}  prop  - property name
 * @return {Boolean}
 */
function isInvariantCase( obj, prop ) {
  const desc = Object.getOwnPropertyDescriptor( obj, prop );
  if ( typeof desc === 'undefined' ) {
    return isInvariantCase( Reflect.getPrototypeOf( obj ), prop );
  }
  return !desc.configurable && !desc.writable;
}

/**
 * immutable proxy handler
 * @type {Object}
 */
const immutableHandler = {

  get( target, prop ) {
    const val = Reflect.get( target, prop );
    if ( isObject( val ) ) {
      return isInvariantCase( target, prop ) ?
        val : createImmutableProxy( val, isStrict( target ) );
    }
    return val;
  },

  set: onMutation,

  deleteProperty: onMutation

};

return exports = ( ...args ) => {
  if ( !isObject( args[ 0 ] ) ) {
    throw new TypeError(
      `Invalid type to freeze: '${ typeof val }'. Only objects can be frozen.`
    );
  }
  return createImmutableProxy( ...args );
};

}));
