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
 * immutable proxy handler
 * @type {Object}
 */
const immutableHandler = {

  get( target, prop ) {
    const val = Reflect.get( target, prop );
    if ( isObject( val ) ) {
      return createImmutableProxy( val, isStrict( target ) );
    }
    return val;
  },

  set: onMutation,

  deleteProperty: onMutation

};

module.exports = createImmutableProxy;
