'use strict';

const { assert, expect }  = require('chai');
const modulePath          = '../../lib/sacrosanct.js';

function getModule() {
  return require('rewire')( modulePath );
}

describe( 'lib/sacrosanct', () => {

  it( 'should export a function', () => {
    let sacrosanct = getModule();
    assert.isFunction( sacrosanct );
  });

  it( 'should return an immutable thing', () => {
    let sacrosanct = getModule();
    let obj = {
      foo: {
        bar: 'baz',
        bing: { boom: true }
      },
      bar: true
    };
    let obj2 = sacrosanct( obj );

    obj2.bar = 'bar';
    expect( obj2.bar ).to.be.true;
    delete obj2.foo;
    expect( obj2.foo ).not.to.be.undefined;
    obj2.foo.bar = 'blah';
    expect( obj2.foo.bar ).to.be.eql('baz');
  });

  it( 'should throw on mutations when strict is true', () => {
    let sacrosanct = getModule();
    let obj = {
      foo: {
        bar: 'baz',
        bing: { boom: true }
      },
      bar: true
    };
    let obj2 = sacrosanct( obj, true );

    assert.throws( () => obj2.bar = 'bar' );
    assert.throws( () => delete obj2.foo );
    assert.throws( () => obj2.foo.bar = 'blah' );
  });

  it( 'should throw on non-object types', () => {
    let sacrosanct = getModule();

    assert.throws( () => sacrosanct('foo') );
    assert.throws( () => sacrosanct( 1 ) );
    assert.throws( () => sacrosanct( true ) );
  });

});
